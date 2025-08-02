// LICENSE : MIT
"use strict";
import React, { useRef, useEffect, useImperativeHandle } from "react";
import CreatableSelect from "react-select/creatable";

function TagSelect({ tags, selectedTags, selectTags, ref }) {
    const selectRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (selectRef.current) {
                selectRef.current.focus({ preventScroll: true });
            }
        }
    }));

    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.focus({ preventScroll: true });
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

    const handleCreate = (inputValue) => {
        const newTag = inputValue.trim();
        if (newTag) {
            const updatedTags = [...selectedTags, newTag];
            selectTags(updatedTags);
        }
    };

    // react-selectのスタイルをTitleInputやURLInputと統一
    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: "auto",
            height: "auto",
            border: "1px solid #aaaaaa",
            borderRadius: "0",
            boxShadow: "none",
            "&:hover": {
                border: "1px solid #aaaaaa"
            }
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "8px 0 8px 0.5em",
            height: "auto"
        }),
        input: (provided) => ({
            ...provided,
            margin: "0",
            padding: "0",
            fontSize: "13px"
        }),
        placeholder: (provided) => ({
            ...provided,
            margin: "0",
            fontSize: "13px"
        }),
        singleValue: (provided) => ({
            ...provided,
            margin: "0",
            fontSize: "13px"
        }),
        multiValue: (provided) => ({
            ...provided,
            margin: "2px",
            fontSize: "13px"
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            fontSize: "13px"
        }),
        option: (provided) => ({
            ...provided,
            fontSize: "13px"
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: "13px"
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999
        })
    };

    return (
        <div className="EditorToolbar">
            <h2 className="l-header">Tags</h2>
            <CreatableSelect
                ref={selectRef}
                name="form-field-name"
                value={selectedOptions}
                options={options}
                isMulti
                isClearable
                placeholder="Select or create tag(s)"
                onChange={handleChange}
                onCreateOption={handleCreate}
                styles={customStyles}
                menuPosition="fixed"
                menuPortalTarget={document.body}
                menuShouldBlockScroll={false}
                formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
            />
        </div>
    );
}

export default TagSelect;
