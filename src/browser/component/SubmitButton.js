// LICENSE : MIT
"use strict";
import React from "react";

export default function SubmitButton({ onSubmit }) {
    return (
        <div className="SubmitButton">
            <button className="flat-button" onClick={onSubmit}>
                Submit
            </button>
        </div>
    );
}
