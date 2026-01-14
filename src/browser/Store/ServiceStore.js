// LICENSE : MIT
"use strict";
import { Store } from "material-flux";
import { keys } from "../Action/ServiceAction";
import Storage from "../storage/Storage";
import manager from "../service-instance";

export default class ServiceStore extends Store {
    constructor(...args) {
        super(...args);
        const ServiceStorage = new Storage("ServiceStorage");
        this.state = {
            title: "example",
            URL: "http://example.com/",
            viaURL: "",
            comment: "",
            quote: "",
            tags: ServiceStorage.get("tags") || [],
            selectedTags: [],
            relatedItems: [],
            enabledServiceIDs: [],
            // Claude Code関連
            claudeCode: {
                status: "idle", // idle | loading | complete | error
                url: null,
                result: null,
                error: null
            }
        };
        this.register(keys.fetchTags, (tags) => {
            if (tags.length > 0) {
                ServiceStorage.set("tags", tags);
            }
            this.setState({
                tags
            });
        });
        this.register(keys.selectTags, (selectedTags) => {
            this.setState({
                selectedTags
            });
        });
        this.register(keys.updateTitle, (title) => {
            this.setState({
                title
            });
        });
        this.register(keys.updateQuote, (text) => {
            if (text.length > 0) {
                this.setState({
                    quote: `「${text}」`
                });
            }
        });

        this.register(keys.updateURL, (URL) => {
            this.setState({
                URL
            });
        });

        this.register(keys.updateViaURL, (viaURL) => {
            this.setState({
                viaURL
            });
        });
        this.register(keys.updateComment, (comment) => {
            this.setState({
                comment
            });
        });

        const resetState = () => {
            const checkedServicesByDefault = manager.getDefaultCheckedService().map((service) => {
                return service.id;
            });
            this.setState({
                title: "",
                URL: "",
                viaURL: "",
                comment: "",
                quote: "",
                selectedTags: [],
                relatedItems: [],
                enabledServiceIDs: checkedServicesByDefault,
                claudeCode: {
                    status: "idle",
                    url: null,
                    result: null,
                    error: null
                }
            });
        };
        this.register(keys.resetField, resetState);
        //this.register(keys.postLink, resetState);
        this.register(keys.enableService, (service) => {
            let enabledServiceIDs = this.state.enabledServiceIDs.slice();
            if (this.state.enabledServiceIDs.indexOf(service.id) === -1) {
                enabledServiceIDs.push(service.id);
            }
            this.setState({
                enabledServiceIDs
            });
        });
        this.register(keys.disableService, (service) => {
            const enabledServiceIDs = this.state.enabledServiceIDs.filter((serviceId) => {
                return service.id !== serviceId;
            });
            this.setState({
                enabledServiceIDs
            });
        });

        this.register(keys.addRelatedItem, (relatedItem) => {
            const relatedItems = this.state.relatedItems.slice();
            relatedItems.push(relatedItem);
            this.setState({ relatedItems });
        });
        this.register(keys.removeRelatedItem, (relatedItem) => {
            var relatedItems = this.state.relatedItems;
            const index = relatedItems.indexOf(relatedItem);
            relatedItems.splice(index, 1);
            this.setState({ relatedItems });
        });
        const updateRelatedItem = (relatedItem) => {
            var relatedItems = this.state.relatedItems;
            const index = relatedItems.indexOf(relatedItem);
            relatedItems[index] = relatedItem;
            this.setState({ relatedItems });
        };
        this.register(keys.editRelatedItem, updateRelatedItem);
        this.register(keys.finishEditingRelatedItem, updateRelatedItem);

        // Claude Code関連
        this.register(keys.claudeCodeStart, ({ url }) => {
            this.setState({
                claudeCode: {
                    status: "loading",
                    url,
                    result: null,
                    error: null
                }
            });
        });

        this.register(keys.claudeCodeComplete, ({ url, result }) => {
            this.setState({
                claudeCode: {
                    status: "complete",
                    url,
                    result,
                    error: null
                }
            });
        });

        this.register(keys.claudeCodeError, ({ url, error }) => {
            this.setState({
                claudeCode: {
                    status: "error",
                    url,
                    result: null,
                    error
                }
            });
        });

        this.register(keys.claudeCodeClear, () => {
            this.setState({
                claudeCode: {
                    status: "idle",
                    url: null,
                    result: null,
                    error: null
                }
            });
        });

        this.register(keys.claudeCodeInsert, () => {
            const { claudeCode, comment } = this.state;
            if (claudeCode.result) {
                // 結果をコメントに挿入（既存のコメントがあれば改行で追加）
                const newComment = comment ? `${comment}\n${claudeCode.result}` : claudeCode.result;
                this.setState({
                    comment: newComment,
                    claudeCode: {
                        status: "idle",
                        url: null,
                        result: null,
                        error: null
                    }
                });
            }
        });
    }
}
