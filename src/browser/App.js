// LICENSE : MIT
"use strict";
import { ipcRenderer } from "electron";
import React from "react";
import { render } from "react-dom";
import Editor from "./component/Editor";
import TagSelect from "./component/TagSelect";
import URLInput from "./component/URLInput";
import ViaURLInput from "./component/ViaURLInput";
import TitleInput from "./component/TitleInput";
import SubmitButton from "./component/SubmitButton";
import RelatedListBox from "./component/RelatedListBox";
import ServiceList from "./component/ServiceList";
import AppContext from "./AppContext";
import serviceManger from "./service-instance";

const appContext = new AppContext();

class App extends React.Component {
    constructor(...args) {
        super(...args);
        this._TagSelect = null;
        this.state = Object.assign({
            initialized: false
        }, appContext.ServiceStore.state);
    }

    componentWillMount() {
        appContext.ServiceStore.onChange(() => {
            let newState = Object.assign({}, this.state, appContext.ServiceStore.state);
            this.setState(newState);
        });
    }

    componentDidMount() {
        let isInitialized = false;
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
            const service = serviceManger.getService("api.b.hatena.ne.jp");
            if (service && state.selectedTags.length === 0 && state.comment.length === 0) {
                appContext.ServiceAction.fetchContent(service, URL).then(({ comment, tags }) => {
                    appContext.ServiceAction.updateComment(comment);
                    appContext.ServiceAction.selectTags(tags);
                }).catch(error => {
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
        // Fetch tags using
        const service = serviceManger.getService("api.b.hatena.ne.jp");
        // Enable hatena by default
        appContext.ServiceAction.enableService(service);
        if (service) {
            appContext.ServiceAction.fetchTags(service);
        }
    }

    postLink() {
        const { ServiceAction } = appContext;
        let postData = {
            title: this.state.title,
            url: this.state.URL,
            viaURL: this.state.viaURL.length > 0 ? this.state.viaURL : null,
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
            const isEnabled = this.state.enabledServiceIDs.some(serviceID => service.id === serviceID);
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
        return <div className="App">
            <ServiceList services={serviceManger.getServices()} enabledServices={this.state.enabledServiceIDs}
                         enableService={enableService}
                         disableService={disableService}
                         login={login}/>
            <TitleInput title={this.state.title} updateTitle={updateTitle}/>
            <URLInput URL={this.state.URL} updateURL={updateURL}/>
            <ViaURLInput URL={this.state.viaURL} updateURL={updateViaURL}/>
            <TagSelect
                ref={(c) => this._TagSelect = c}
                tags={this.state.tags}
                selectTags={selectTags}
                selectedTags={this.state.selectedTags}/>
            <Editor value={this.state.comment} onChange={updateComment}
                    onSubmit={submitPostLink}
                    services={services}
                    toggleServiceAtIndex={toggleServiceAtIndex}/>
            <RelatedListBox relatedItems={this.state.relatedItems}
                            editItem={editItem}
                            finishEditing={finishEditing}
                            addItem={addItem}/>
            <SubmitButton onSubmit={submitPostLink}/>
        </div>;
    }
}

appContext.on("dispatch", ({ eventKey }) => {
    ipcRenderer.send(String(eventKey));
});
render(<App/>, document.getElementById("js-main"));
