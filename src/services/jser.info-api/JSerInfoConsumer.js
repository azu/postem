// LICENSE : MIT
const getConsumer = async () => {
    const consumer = await import("./consumer.js");
    return consumer.default;
};
export default await getConsumer();
