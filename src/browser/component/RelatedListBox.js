// LICENSE : MIT
"use strict";
import React from "react"
export class RelatedItem extends React.Component {
    componentDidMount() {
        if(this.props.isEditing) {
            this.refs.input.focus();
        }
    }
    render() {
        const linkClassName = this.props.isEditing ? "hidden" : "";
        const inputClassName = this.props.isEditing ? "RelatedItem-edit" : "RelatedItem-edit hidden";
        const value = JSON.stringify({
            title: this.props.title,
            URL: this.props.URL
        });
        const onSubmit = (event) => {
            event.preventDefault();
            const value = this.refs.input.value;
            this.props.onSubmit(value);
        };
        return <form className="RelatedItem" onSubmit={onSubmit}>
            <a href={this.props.URL} onClick={this.props.onClick} className={linkClassName}>{this.props.title}</a>
            <input className={inputClassName} title="Editing" defaultValue={value} ref="input"/>
        </form>
    }
}

export default class RelatedListBox extends React.Component {
    render() {
        const items = this.props.relatedItems.map(item => {
            const editItem = (event) => {
                event.preventDefault();
                this.props.editItem(item);
            };
            const finishEditingItem = (value) => {
                this.props.finishEditing(item, value)
            };
            return <li key={item.id}><RelatedItem
                title={item.title} URL={item.URL}
                isEditing={item.isEditing}
                onClick={editItem}
                onSubmit={finishEditingItem}/></li>
        });
        return <div className="RelatedListBox">
            <h2 className="l-header">Related Item</h2>
            <ul className="RelatedList">
                {items}
            </ul>
            <button className="RelatedListBox-Add flat-button" onClick={this.props.addItem} value="Add">Add</button>
        </div>;
    }
}