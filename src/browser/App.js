// LICENSE : MIT
"use strict";
import {ipcRenderer} from "electron";
import React from "react";
import {render} from "react-dom";
import Editor from "./component/Editor";
import TagSelect from "./component/TagSelect";
import URLInput from "./component/URLInput";
import TitleInput from "./component/TitleInput";
import SubmitButton from "./component/SubmitButton";
import ServiceList from "./component/ServiceList";
import AppContext from "./AppContext";
import serviceManger from "./service-instance";
const appContext = new AppContext();
class App extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = Object.assign({}, appContext.ServiceStore.state);
    }

    componentWillMount() {
        appContext.ServiceStore.onChange(() => {
            let newState = Object.assign({}, this.state, appContext.ServiceStore.state);
            this.setState(newState);
        });
    }

    postLink() {
        const { ServiceAction } = appContext;
        let postData = {
            url: this.state.URL,
            comment: this.state.comment,
            tags: this.state.selectedTags
        };
        ServiceAction.postLink(postData);
    }

    render() {
        const { ServiceAction } = appContext;
        const selectTags = ServiceAction.selectTags.bind(ServiceAction);
        const updateTitle = ServiceAction.updateTitle.bind(ServiceAction);
        const updateURL = ServiceAction.updateURL.bind(ServiceAction);
        const updateComment = ServiceAction.updateComment.bind(ServiceAction);
        const login = () => {
            ServiceAction.loginHatebu("Hatena");
        };
        const enableService = (service) => {
            ServiceAction.enableService(service);
        };
        const disableService = (service) => {
            ServiceAction.disableService(service);
        };
        return <div className="App">
            <ServiceList services={serviceManger.getServices()} enabledServices={this.state.enableServices}
                         enableService={enableService}
                         disableService={disableService}/>
            <TitleInput title={this.state.title} updateTitle={updateTitle}/>
            <URLInput URL={this.state.URL} updateURL={updateURL}/>
            <TagSelect tags={this.state.tags} selectTags={selectTags} selectedTags={this.state.selectedTags}/>
            <Editor value={this.state.comment} onChange={updateComment}/>
            <SubmitButton onSubmit={this.postLink.bind(this)}/>
            <button onClick={login}>ログイン</button>
        </div>;
    }
}
// ipc from server event
ipcRenderer.on("updateTitle", (event, title) => {
    appContext.ServiceAction.updateTitle(title);
});
ipcRenderer.on("updateURL", (event, URL) => {
    appContext.ServiceAction.updateURL(URL);
});
appContext.ServiceAction.fetchTags("Hatena");
render(<App />, document.getElementById("js-main"));
