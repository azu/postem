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
        const selectTags = this.props.selectTags;
        const selectedTagValue = (this.props.selectedTags || []).join(",");

        function logChange(val) {
            var tags = val.split(",") || [];
            console.log("Selected: " + val);
            selectTags(tags);
        }

        return <div className="EditorToolbar">
            <Select
                name="form-field-name"
                value={selectedTagValue}
                options={options}
                multi={true}
                allowCreate={true}
                placeholder="Select your favourite(s)"
                onChange={logChange}
            />
        </div>
    }
}