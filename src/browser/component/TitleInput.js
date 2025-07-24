// LICENSE : MIT
"use strict";
import React, { useState, useEffect } from "react";

export default function TitleInput({ title, updateTitle }) {
    const [value, setValue] = useState(title);

    useEffect(() => {
        setValue(title);
    }, [title]);

    const onChange = ({ target }) => {
        const newValue = target.value;
        updateTitle(newValue);
        setValue(newValue);
    };

    return (
        <div className="TitleInput">
            <h2 className="l-header">Title & URL</h2>
            <input type="text" placeholder="title" value={value} onChange={onChange} />
        </div>
    );
}
