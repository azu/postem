// LICENSE : MIT
export default class JSerModel {
    constructor() {
        this.id = "com.example.debug";
        this.name = "Debug Model";
        this.description = "for debug";
        this.icon = __dirname + "/debug.png";
        this.tagService = true; // テスト用にTagService機能を有効化
    }
}
