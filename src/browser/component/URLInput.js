// LICENSE : MIT
"use strict";
import React, { useState, useEffect } from "react";

export default function URLInput({ URL, updateURL }) {
    const [value, setValue] = useState(URL);

    useEffect(() => {
        setValue(URL);
    }, [URL]);

    const onChange = ({ target }) => {
        const newValue = target.value;
        updateURL(newValue);
        setValue(newValue);
    };

    return (
        <div className="URLInput">
            <input type="text" placeholder="URL" value={value} pattern="^(?!.*#.*).+$" onChange={onChange} />
        </div>
    );
}
