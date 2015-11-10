// LICENSE : MIT
"use strict";
import React from "react"
import Select from "react-select";
export default class SubmitButton extends React.Component {
    render() {
        return <div className="SubmitButton">
            <button onClick={this.props.onSubmit}>送信</button>
        </div>
    }
}