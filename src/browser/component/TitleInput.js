// LICENSE : MIT
"use strict";
import React from "react"
export default class TitleInput extends React.Component {
    onChange({target}) {
        let value = target.value;
        this.props.updateTitle(value);
    }

    render() {
        return <div className="TitleInput">
            <label>
                Title:
            </label>
            <input type="text" defaultValue={this.props.title} onInput={this.onChange.bind(this)}/>
        </div>
    }
}