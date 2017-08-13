// LICENSE : MIT
"use strict";
const React = require("react");
const ReactCodeMirror = require('react-codemirror');
export default class Editor extends React.Component {
    focus() {
        if (this.editor) {
            this.editor.focus();
        }
    }

    render() {
        const extraKeys = {
            "Cmd-Enter": () => {
                this.props.onSubmit();
            }
        };
        const options = {
            extraKeys: extraKeys
        };
        return <div className="Editor">
            <ReactCodeMirror
                ref={(c) => this.editor = c}
                value={this.props.value}
                onChange={this.props.onChange}
                options={options}/>
        </div>
    }
}