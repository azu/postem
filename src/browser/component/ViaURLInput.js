// LICENSE : MIT
import React, { useState, useEffect } from "react";

export default function ViaURLInput({ URL, updateURL }) {
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
        <div className="ViaURLInput">
            <input type="text" placeholder="via URL" value={value} pattern="^(?!.*#.*).+$" onChange={onChange} />
        </div>
    );
}
