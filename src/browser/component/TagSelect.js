// LICENSE : MIT
import React, { useRef, useEffect, useImperativeHandle } from "react";
import Select from "react-select";

function TagSelect({ tags, selectedTags, selectTags, ref }) {
    const selectRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (selectRef.current) {
                selectRef.current.focus();
            }
        }
    }));

    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.focus();
        }
    }, []);

    const options = tags.map((tag) => ({
        label: tag,
        value: tag
    }));

    const selectedOptions = selectedTags.map((tag) => ({
        label: tag,
        value: tag
    }));

    const handleChange = (selectedOptions) => {
        const tags = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        selectTags(tags);
    };

    return (
        <div className="EditorToolbar">
            <h2 className="l-header">Tags</h2>
            <Select
                ref={selectRef}
                name="form-field-name"
                value={selectedOptions}
                options={options}
                isMulti
                isClearable
                placeholder="Select Tag(s)"
                onChange={handleChange}
            />
        </div>
    );
}

export default TagSelect;
