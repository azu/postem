export default {
    resetField: Symbol("resetField"),
    fetchTags: Symbol("fetchTags"),
    fetchContent: Symbol("fetchContent"),
    postLink: Symbol("postLink"),
    selectTags: Symbol("selectTags"),
    updateTitle: Symbol("updateTitle"),
    updateURL: Symbol("updateURL"),
    updateQuote: Symbol("updateQuote"),
    updateViaURL: Symbol("updateViaURL"),
    updateComment: Symbol("updateComment"),
    editRelatedItem: Symbol("editRelatedItem"),
    addRelatedItem: Symbol("addRelatedItem"),
    removeRelatedItem: Symbol("removeRelatedItem"),
    finishEditingRelatedItem: Symbol("finishEditingRelatedItem"),
    enableService: Symbol("enableService"),
    disableService: Symbol("disableService"),
    // Claude Code関連
    claudeCodeStart: Symbol("claudeCodeStart"),
    claudeCodeComplete: Symbol("claudeCodeComplete"),
    claudeCodeError: Symbol("claudeCodeError"),
    claudeCodeClear: Symbol("claudeCodeClear"),
    claudeCodeInsert: Symbol("claudeCodeInsert")
};
