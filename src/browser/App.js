// LICENSE : MIT
"use strict";
import ipc from "ipc";
import React from "react";
import {render} from "react-dom";
import Editor from "./editor/Editor";
import TagSelect from "./editor/TagSelect";
import URLInput from "./editor/URLInput";
import TitleInput from "./editor/TitleInput";
import SubmitButton from "./editor/SubmitButton";
import AppContext from "./AppContext";
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
        return <div className="App">
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
ipc.on("updateTitle", (title) => {
    appContext.ServiceAction.updateTitle(title);
});
ipc.on("updateURL", (URL) => {
    appContext.ServiceAction.updateURL(URL);
});
appContext.ServiceAction.fetchTags("Hatena");
render(<App />, document.getElementById("js-main"));
