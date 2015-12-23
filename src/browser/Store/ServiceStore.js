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
    }
}