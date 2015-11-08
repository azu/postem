// LICENSE : MIT
"use strict";
import React from "react"
export default class URLInput extends React.Component {
    render() {
        return <div className="URLInput">
            <input type="text" value={this.props.URL}/>
        </div>
    }
}