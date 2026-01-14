// LICENSE : MIT
"use strict";
import React from "react";
import { createRoot } from "react-dom/client";
import Editor from "./component/Editor";
import TagSelect from "./component/TagSelect";
import URLInput from "./component/URLInput";
import ViaURLInput from "./component/ViaURLInput";
import TitleInput from "./component/TitleInput";
import SubmitButton from "./component/SubmitButton";
import RelatedListBox from "./component/RelatedListBox";
import ServiceList from "./component/ServiceList";
import ClaudeCodeButton from "./component/ClaudeCodeButton";
import ClaudeCodePreview from "./component/ClaudeCodePreview";
import AppContext from "./AppContext";
import serviceManger, { waitForInitialization, getClaudeCodeConfig } from "./service-instance";

const ipcRenderer = require("electron").ipcRenderer;
const appContext = new AppContext();

class App extends React.Component {
    constructor(...args) {
        super(...args);
        this._TagSelect = null;
        this._claudeCodeConfig = getClaudeCodeConfig();
        this.state = Object.assign(
            {
                initialized: false
            },
            appContext.ServiceStore.state
        );

        // サービスの初期化状態は別管理（ServiceStoreの変更で上書きされないように）
        this._serviceInitialized = false;
    }

    async componentDidMount() {
        // サービスの初期化を待つ
        try {
            await waitForInitialization();
            this._serviceInitialized = true;
            this.forceUpdate();
        } catch (error) {
            console.error("Failed to initialize services:", error);
            // エラーが発生しても表示（シークレットがフォールバック値になる）
            this._serviceInitialized = true;
            this.forceUpdate();
        }

        // ServiceStore の変更を監視（componentDidMountで登録）
        this.unsubscribe = appContext.ServiceStore.onChange(() => {
            let newState = Object.assign({}, this.state, appContext.ServiceStore.state);
            this.setState(newState);
        });

        // 元のcomponentDidMountの処理
        let isInitialized = false;
        appContext.ServiceAction.resetField();
        // ipc from server event
        ipcRenderer.on("beforeUpdate", (event, { title, url }) => {
            const state = this.state;
            if (title !== state.title || url !== state.URL) {
                appContext.ServiceAction.resetField();
                isInitialized = true;
            }
        });
        ipcRenderer.on("updateTitle", (event, title) => {
            appContext.ServiceAction.updateTitle(title);
        });
        ipcRenderer.on("updateURL", (event, URL) => {
            appContext.ServiceAction.updateURL(URL);
            const state = appContext.ServiceStore.state;
            const service = serviceManger.getTagService();
            if (service && state.selectedTags.length === 0 && state.comment.length === 0) {
                appContext.ServiceAction.fetchContent(service, URL)
                    .then((result) => {
                        if (!result) return;
                        const { comment, tags, relatedItems } = result;
                        if (comment) {
                            appContext.ServiceAction.updateComment(comment);
                        }
                        if (Array.isArray(tags) && tags.length > 0) {
                            appContext.ServiceAction.selectTags(tags);
                        }
                        if (Array.isArray(relatedItems)) {
                            relatedItems.forEach((relatedItem) => {
                                appContext.ServiceAction.addRelatedItem(relatedItem);
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("fetchContent:error", error);
                    });
            }
        });
        ipcRenderer.on("afterUpdate", (event, { title, url }) => {
            if (isInitialized) {
                if (this._TagSelect) {
                    this._TagSelect.focus();
                }
                isInitialized = false;
            }
        });
        ipcRenderer.on("resetField", (event) => {
            appContext.ServiceAction.resetField();
        });
        // Fetch tags from tagService after services are initialized
        waitForInitialization().then(() => {
            const service = serviceManger.getTagService();
            if (service) {
                appContext.ServiceAction.fetchTags(service);
            } else {
                console.error("TagService should be available at least one");
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    postLink() {
        const { ServiceAction } = appContext;
        let postData = {
            title: this.state.title,
            url: this.state.URL,
            viaURL: this.state.viaURL.length > 0 ? this.state.viaURL : undefined,
            comment: this.state.comment,
            tags: this.state.selectedTags,
            relatedItems: this.state.relatedItems
        };
        if (!postData.title || !postData.url) {
            return;
        }
        const services = serviceManger.selectServices(this.state.enabledServiceIDs);
        ServiceAction.postLink(services, postData);
    }

    render() {
        if (!this._serviceInitialized) {
            return (
                <div
                    className="App"
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
                >
                    <div style={{ textAlign: "center" }}>
                        <p>Loading...</p>
                    </div>
                </div>
            );
        }

        const { ServiceAction } = appContext;
        const selectTags = ServiceAction.selectTags.bind(ServiceAction);
        const updateTitle = ServiceAction.updateTitle.bind(ServiceAction);
        const updateURL = ServiceAction.updateURL.bind(ServiceAction);
        const updateViaURL = ServiceAction.updateViaURL.bind(ServiceAction);
        const updateComment = ServiceAction.updateComment.bind(ServiceAction);
        const services = serviceManger.getServices();
        const toggleServiceAtIndex = (index) => {
            const service = serviceManger.getServices()[index];
            if (service) {
                toggleService(service);
            }
        };
        const toggleService = (service) => {
            const isEnabled = this.state.enabledServiceIDs.some((serviceID) => service.id === serviceID);
            if (isEnabled) {
                disableService(service);
            } else {
                enableService(service);
            }
        };
        const enableService = (service) => {
            ServiceAction.enableService(service);
        };
        const disableService = (service) => {
            ServiceAction.disableService(service);
        };
        const login = (service) => {
            ServiceAction.login(service);
        };
        const editItem = (relatedItem) => {
            ServiceAction.editRelatedItem(relatedItem);
        };
        const finishEditing = (relatedItem, value) => {
            ServiceAction.finishEditingRelatedItem(relatedItem, value);
        };
        const addItem = () => {
            ServiceAction.addRelatedItem();
        };
        const submitPostLink = this.postLink.bind(this);

        // Claude Code関連
        const runClaudeCode = (url, title, config) => {
            ServiceAction.runClaudeCode(url, title, config);
        };
        const insertClaudeCodeResult = () => {
            ServiceAction.insertClaudeCodeResult();
        };
        const clearClaudeCodeResult = () => {
            ServiceAction.clearClaudeCodeResult();
        };

        return (
            <div className="App">
                <ServiceList
                    services={serviceManger.getServices()}
                    enabledServices={this.state.enabledServiceIDs}
                    enableService={enableService}
                    disableService={disableService}
                    login={login}
                />
                <TitleInput title={this.state.title} updateTitle={updateTitle} />
                <div className="URLInputRow">
                    <URLInput URL={this.state.URL} updateURL={updateURL} />
                    <ClaudeCodeButton
                        url={this.state.URL}
                        title={this.state.title}
                        claudeCode={this.state.claudeCode}
                        runClaudeCode={runClaudeCode}
                        insertResult={insertClaudeCodeResult}
                        clearResult={clearClaudeCodeResult}
                        claudeCodeConfig={this._claudeCodeConfig}
                    />
                </div>
                <ViaURLInput URL={this.state.viaURL} updateURL={updateViaURL} />
                <TagSelect
                    ref={(c) => (this._TagSelect = c)}
                    tags={this.state.tags}
                    selectTags={selectTags}
                    selectedTags={this.state.selectedTags}
                />
                <ClaudeCodePreview
                    claudeCode={this.state.claudeCode}
                    insertResult={insertClaudeCodeResult}
                    clearResult={clearClaudeCodeResult}
                />
                <Editor
                    value={this.state.comment}
                    onChange={updateComment}
                    onSubmit={submitPostLink}
                    services={services}
                    toggleServiceAtIndex={toggleServiceAtIndex}
                    onInsertClaudeCode={insertClaudeCodeResult}
                />
                <RelatedListBox
                    relatedItems={this.state.relatedItems}
                    editItem={editItem}
                    finishEditing={finishEditing}
                    addItem={addItem}
                />
                <SubmitButton onSubmit={submitPostLink} />
            </div>
        );
    }
}

appContext.on("dispatch", ({ eventKey }) => {
    ipcRenderer.send(String(eventKey));
});

// アプリを即座に起動（初期化はコンポーネント内で処理）
try {
    const root = createRoot(document.getElementById("js-main"));
    root.render(<App />);
    console.log("React app rendered successfully");
} catch (error) {
    console.error("Error rendering React app:", error);
}
