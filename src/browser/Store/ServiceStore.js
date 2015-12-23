// LICENSE : MIT
"use strict";
import { Store } from "material-flux";
import { keys } from "../Action/ServiceAction";
export default class ServiceStore extends Store {
    constructor(...args) {
        super(...args);
        this.state = {
            title: "example",
            URL: "http://example.com/",
            comment: "",
            tags: [],
            selectedTags: [],
            relatedItems: [],
            enabledServiceIDs: ["api.b.hatena.ne.jp"]
        };
        this.register(keys.fetchTags, (tags) => {
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
        this.register(keys.updateURL, (URL) => {
            this.setState({
                URL
            });
        });
        this.register(keys.updateComment, (comment) => {
            this.setState({
                comment
            });
        });

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
            const enabledServiceIDs = this.state.enabledServiceIDs.filter(serviceId => {
                return service.id !== serviceId;
            });
            this.setState({
                enabledServiceIDs
            });
        });

        this.register(keys.addRelatedItem, (relatedItem) => {
            const relatedItems = this.state.relatedItems.slice();
            relatedItems.push(relatedItem);
            this.setState({relatedItems});
        });
        this.register(keys.removeRelatedItem, (relatedItem) => {
            var relatedItems = this.state.relatedItems;
            const index = relatedItems.indexOf(relatedItem);
            relatedItems.splice(index, 1);
            this.setState({relatedItems});
        });
        const updateRelatedItem = (relatedItem) => {
            var relatedItems = this.state.relatedItems;
            const index = relatedItems.indexOf(relatedItem);
            relatedItems[index] = relatedItem;
            this.setState({relatedItems});
        };
        this.register(keys.editRelatedItem, updateRelatedItem);
        this.register(keys.finishEditingRelatedItem, updateRelatedItem);
    }
}