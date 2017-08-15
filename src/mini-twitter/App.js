// LICENSE : MIT
"use strict";
import { ipcRenderer } from "electron";
import React from "react";
import { render } from "react-dom";
import AppContext from "../browser/AppContext";
import serviceManger from "../browser/service-instance";
import Editor from "./component/Editor";
import TweetLengthCounter from "./component/TweetLengthCounter";

const appContext = new AppContext();

class App extends React.Component {
    constructor() {
        super();
        this.state = Object.assign({
            initialized: false
        }, appContext.ServiceStore.state);
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
        ipcRenderer.on("afterUpdate", (event, { title, url }) => {
            if (this.editor) {
                this.editor.focus();
            }
        });
        ipcRenderer.on("updateTitle", (event, title) => {
            appContext.ServiceAction.updateTitle(title);
        });
        ipcRenderer.on("updateQuote", (event, text) => {
            appContext.ServiceAction.updateQuote(text);
        });
        ipcRenderer.on("updateURL", (event, URL) => {
            appContext.ServiceAction.updateURL(URL);
        });
        ipcRenderer.on("afterUpdate", (event, { title, url }) => {
        });
        ipcRenderer.on("resetField", (event) => {
            appContext.ServiceAction.resetField();
        });
        // Enable twitter by default
        const service = serviceManger.getService("com.twitter");
        appContext.ServiceAction.enableService(service);
        // default comment
        if (this.editor) {
            this.editor.focus();
        }
    }

    componentWillMount() {
        appContext.ServiceStore.onChange(() => {
            let newState = Object.assign({}, this.state, appContext.ServiceStore.state);
            this.setState(newState);
        });
    }

    postLink() {
        const { ServiceAction } = appContext;
        const postData = {
            title: this.state.title,
            url: this.state.URL,
            viaURL: this.state.viaURL.length > 0 ? this.state.viaURL : null,
            quote: this.state.quote,
            comment: this.state.comment || "見てる:",
            tags: this.state.selectedTags,
            relatedItems: this.state.relatedItems
        };
        if (!postData.title || !postData.url) {
            return;
        }
        const services = serviceManger.selectServices(["com.twitter"]);
        ServiceAction.postLink(services, postData);
    }

    render() {
        const { ServiceAction } = appContext;
        const updateComment = ServiceAction.updateComment.bind(ServiceAction);
        const submitPostLink = this.postLink.bind(this);
        return <div className="App">
            <Editor
                ref={(c) => this.editor = c}
                value={this.state.comment}
                onSubmit={submitPostLink}
                onChange={updateComment}/>
            <TweetLengthCounter
                title={this.state.title}
                url={this.state.URL}
                quote={this.state.quote}
                comment={this.state.comment}/>
        </div>;
    }
}

appContext.on("dispatch", ({ eventKey }) => {
    ipcRenderer.send(String(eventKey));
});
render(<App/>, document.getElementById("js-main"));
