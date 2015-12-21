// LICENSE : MIT
"use strict";
import React from "react"
export default class URLInput extends React.Component {
    onChange({target}) {
        let value = target.value;
        this.props.updateURL(value);
    }

    render() {
        return <div className="URLInput">
            <input type="text" defaultValue={this.props.URL} onChange={this.onChange.bind(this)}/>
        </div>
    }
}