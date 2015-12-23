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
        // fn
        const selectTags = this.props.selectTags;
        // tags[]
        const selectedTagValue = this.props.selectedTags.join(",");

        function logChange(val) {
            var tags = val.split(",") || [];
            selectTags(tags);
        }

        return <div className="EditorToolbar">
            <h2 className="l-header">Tags</h2>
            <Select
                name="form-field-name"
                value={selectedTagValue}
                options={options}
                multi={true}
                allowCreate={true}
                placeholder="Select Tag(s)"
                onChange={logChange}
            />
        </div>
    }
}