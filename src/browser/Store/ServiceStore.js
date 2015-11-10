// LICENSE : MIT
"use strict";
import { Store } from "material-flux";
import { keys } from "../Action/ServiceAction";
export default class ServiceStore extends Store {
    constructor(...args) {
        super(...args);
        this.state = {
            title: "",
            URL: "",
            tags: [],
            selectedTags: []
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
        })
    }
}