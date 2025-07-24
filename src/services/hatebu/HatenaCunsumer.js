// LICENSE : MIT
let myConsumer;
try {
    const consumerModule = await import("./consumer.json", { assert: { type: "json" } });
    myConsumer = consumerModule.default;
} catch (error) {}
// マシンごとに異なるconsumerを用意しないといけない
// https://github.com/hatena/Hatena-Bookmark-iOS-SDK/issues/40
const builtinConsumer = myConsumer || {
    key: "elj9OpeplSmpfA==",
    secret: "1hqDhJ2BfB6kozd/nHeLIW7WC/Y="
};
export default builtinConsumer;
