// MIT © 2017 azu
"use strict";
const React = require("react");
import { truncate } from "tweet-truncator";

export default class TweetLengthCounter extends React.Component {
    render() {
        const { title, url, comment } = this.props;
        const contents = { title, url, desc: comment };
        const status = truncate(contents, {
            template: `%desc% "%title%" %url%`
        });
        const style = {
            lineHeight: "1.2",
            backgroundColor: "white",
            overflow: "scroll",
            padding: "4px"
        };
        return <p style={style} className="TweetLengthCounter"><b>{status.length}</b>: {status}</p>
    }
}