// LICENSE : MIT
"use strict";
import React, { useRef, useEffect } from "react";

export function RelatedItem({ title, URL, isEditing, onClick, onSubmit }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const linkClassName = isEditing ? "hidden" : "";
    const inputClassName = isEditing ? "RelatedItem-edit" : "RelatedItem-edit hidden";
    const value = JSON.stringify({
        title: title,
        URL: URL
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const value = inputRef.current.value;
        onSubmit(value);
    };

    return (
        <form className="RelatedItem" onSubmit={handleSubmit}>
            <a href={URL} onClick={onClick} className={linkClassName}>
                {title}
            </a>
            <input className={inputClassName} title="Editing" defaultValue={value} ref={inputRef} />
        </form>
    );
}

export default function RelatedListBox({ relatedItems, editItem, finishEditing, addItem }) {
    const items = relatedItems.map((item) => {
        const editItemHandler = (event) => {
            event.preventDefault();
            editItem(item);
        };
        const finishEditingItem = (value) => {
            finishEditing(item, value);
        };
        return (
            <li key={item.id}>
                <RelatedItem
                    title={item.title}
                    URL={item.URL}
                    isEditing={item.isEditing}
                    onClick={editItemHandler}
                    onSubmit={finishEditingItem}
                />
            </li>
        );
    });

    return (
        <div className="RelatedListBox">
            <h2 className="l-header">Related Item</h2>
            <ul className="RelatedList">{items}</ul>
            <button className="RelatedListBox-Add flat-button" onClick={addItem} value="Add">
                Add
            </button>
        </div>
    );
}
