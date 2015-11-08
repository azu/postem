// LICENSE : MIT
"use strict";
import React from "react";
import {render} from "react-dom";
import Editor from "./editor/Editor";
import TagSelect from "./editor/TagSelect";
import URLInput from "./editor/URLInput";
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

    render() {
        const { ServiceAction } = appContext;
        const selectTags = ServiceAction.selectTags.bind(ServiceAction);
        return <div className="App">
            <TagSelect tags={this.state.tags} selectTags={selectTags} selectedTags={this.state.selectedTags}/>
            <URLInput URL="http://example.com"/>
            <Editor source="Sebastian"/>
        </div>;
    }
}
appContext.ServiceAction.fetchTags("Hatena");
render(<App />, document.getElementById("js-main"));
