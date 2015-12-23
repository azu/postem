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
import RelatedListBox from "./component/RelatedListBox";
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
        const service = serviceManger.getService("api.b.hatena.ne.jp");
        if (service) {
            appContext.ServiceAction.fetchTags(service);
        }
    }

    postLink() {
        const { ServiceAction } = appContext;
        let postData = {
            title: this.state.title,
            url: this.state.URL,
            comment: this.state.comment,
            tags: this.state.selectedTags,
            relatedItems: this.state.relatedItems
        };
        var services = serviceManger.selectServices(this.state.enabledServiceIDs);
        ServiceAction.postLink(services, postData);
    }

    render() {
        const { ServiceAction } = appContext;
        const selectTags = ServiceAction.selectTags.bind(ServiceAction);
        const updateTitle = ServiceAction.updateTitle.bind(ServiceAction);
        const updateURL = ServiceAction.updateURL.bind(ServiceAction);
        const updateComment = ServiceAction.updateComment.bind(ServiceAction);
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
        return <div className="App">
            <ServiceList services={serviceManger.getServices()} enabledServices={this.state.enabledServiceIDs}
                         enableService={enableService}
                         disableService={disableService}
                         login={login}/>
            <TitleInput title={this.state.title} updateTitle={updateTitle}/>
            <URLInput URL={this.state.URL} updateURL={updateURL}/>
            <TagSelect tags={this.state.tags} selectTags={selectTags} selectedTags={this.state.selectedTags}/>
            <Editor value={this.state.comment} onChange={updateComment}/>
            <RelatedListBox relatedItems={this.state.relatedItems}
                            editItem={editItem}
                            finishEditing={finishEditing}
                            addItem={addItem}/>
            <SubmitButton onSubmit={this.postLink.bind(this)}/>
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
render(<App />, document.getElementById("js-main"));
