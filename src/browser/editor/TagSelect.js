// LICENSE : MIT
"use strict";
import React from "react"
import Select from "react-select";
export default class TagSelect extends React.Component {
    render() {
        var options = this.props.tags.map(tag => {
            return {
                label: tag,
                value: tag
            }
        });

        function logChange(val) {
            console.log("Selected: " + val);
        }

        return <div className="EditorToolbar">
            <Select
                name="form-field-name"
                options={options}
                multi={true}
                allowCreate={true}
                placeholder="Select your favourite(s)"
                onChange={logChange}
            />
        </div>
    }
}