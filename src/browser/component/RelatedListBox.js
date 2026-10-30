// LICENSE : MIT
"use strict";
import React, { useRef, useEffect, useState } from "react";

const ipcRenderer = require("electron").ipcRenderer;

const isWebURL = (value) => {
    try {
        return ["http:", "https:"].includes(new globalThis.URL(value).protocol);
    } catch (error) {
        return false;
    }
};

export function RelatedItem({ title, URL, isEditing, onClick, onSubmit }) {
    const inputRef = useRef(null);
    const currentValueRef = useRef("");
    const pendingRef = useRef(null);
    const [value, setValue] = useState(URL ? JSON.stringify({ title, URL }) : "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEditing) return;
        const initialValue = URL ? JSON.stringify({ title, URL }) : "";
        currentValueRef.current = initialValue;
        setValue(initialValue);
        setError("");
        inputRef.current?.focus();
    }, [isEditing]);

    const fetchAndSave = (url) => {
        if (pendingRef.current?.url === url) return pendingRef.current.promise;
        setLoading(true);
        setError("");
        const promise = ipcRenderer
            .invoke("fetchRelatedTitle", url)
            .then((fetchedTitle) => {
                if (currentValueRef.current === url) {
                    onSubmit({ title: fetchedTitle, URL: url });
                }
            })
            .catch(() => {
                if (currentValueRef.current === url) {
                    setError("タイトルを取得できませんでした。JSONでタイトルを入力してください。");
                }
            })
            .finally(() => {
                if (pendingRef.current?.promise === promise) pendingRef.current = null;
                if (currentValueRef.current === url) setLoading(false);
            });
        pendingRef.current = { url, promise };
        return promise;
    };

    useEffect(() => {
        if (!isEditing || !isWebURL(value)) return;
        const timeout = setTimeout(() => fetchAndSave(value), 700);
        return () => clearTimeout(timeout);
    }, [value, isEditing]);

    const handleChange = ({ target }) => {
        const nextValue = target.value.trim();
        currentValueRef.current = nextValue;
        setValue(nextValue);
        setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!value) {
            onSubmit({ title: "", URL: "" });
        } else if (isWebURL(value)) {
            fetchAndSave(value);
        } else {
            try {
                const parsed = JSON.parse(value);
                const editedTitle = parsed.title || parsed.TITLE;
                const editedURL = parsed.URL || parsed.url;
                if (!editedTitle || !isWebURL(editedURL)) throw new Error("Invalid related item");
                onSubmit({ title: editedTitle, URL: editedURL });
            } catch (parseError) {
                setError("URL、または title と URL を含むJSONを入力してください。");
            }
        }
    };

    return (
        <form className="RelatedItem" onSubmit={handleSubmit}>
            <a href={URL} onClick={onClick} className={isEditing ? "hidden" : ""}>
                {title}
            </a>
            {isEditing && (
                <>
                    <input
                        className="RelatedItem-edit"
                        title="Editing"
                        placeholder="Related URL or JSON"
                        value={value}
                        onChange={handleChange}
                        ref={inputRef}
                    />
                    {loading && <span role="status">タイトルを取得中…</span>}
                    {error && <span role="alert">{error}</span>}
                </>
            )}
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
