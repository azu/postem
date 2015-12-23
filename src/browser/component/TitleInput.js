// LICENSE : MIT
"use strict";
import React from "react"
export default class TitleInput extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            value: this.props.title
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value === nextProps.title) {
            return;
        }
        this.setState({
            value: nextProps.title
        });
    }

    onChange({target}) {
        let value = target.value;
        this.props.updateTitle(value);
        this.setState({value})
    }

    render() {
        return <div className="TitleInput">
            <h2 className="l-header">Title & URL</h2>
            <input type="text" placeholder="title" value={this.state.value} onChange={this.onChange.bind(this)}/>
        </div>
    }
}