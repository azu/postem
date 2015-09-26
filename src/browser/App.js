// LICENSE : MIT
"use strict";
import React from "react";
import Editor from "./editor/Editor";
import TagSelect from "./editor/TagSelect";
import ipc from "ipc";
ipc.on("HatenaService-getTags", (tags) => {
    React.render(<div className="App">
        <TagSelect tags={tags}/>
        <Editor source="Sebastian"/>
    </div>, document.getElementById("js-main"));
});
ipc.send("HatenaService-getTags");
