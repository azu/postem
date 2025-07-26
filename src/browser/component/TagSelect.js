// LICENSE : MIT
"use strict";
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

    // react-selectのスタイルをTitleInputやURLInputと統一
    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: "4px 0 4px 0.5em",
            border: "1px solid #aaaaaa",
            minHeight: "38px",
            borderRadius: "0",
            boxShadow: "none",
            "&:hover": {
                border: "1px solid #aaaaaa"
            }
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "0"
        }),
        input: (provided) => ({
            ...provided,
            margin: "0",
            padding: "0"
        })
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
                styles={customStyles}
            />
        </div>
    );
}

export default TagSelect;
