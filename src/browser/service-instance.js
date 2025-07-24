// LICENSE : MIT
// service
import ServiceManger from "./service-manager.js";

// FIXME: use IPC
const manager = new ServiceManger();

const getServiceNameList = async () => {
    if (process.env.PLAYWRIGHT_TEST === "1" || process.title?.includes("playwright")) {
        const module = await import("../../tests/fixtures/test-services.js");
        return module.default;
    } else {
        const module = await import("../service.js");
        return module.default;
    }
};

const initializeServices = async () => {
    const serviceList = await getServiceNameList();
    const services = await Promise.all(
        serviceList
            .filter((service) => {
                return service.enabled;
            })
            .map(async (service) => {
                const { Model, Client } = service.index ? service.index : await import(service.indexPath);
                const client = new Client(service.options);
                return {
                    model: new Model(),
                    client: client,
                    isDefaultChecked: service.isDefaultChecked && client.isLogin()
                };
            })
    );
    services.forEach(({ model, client, isDefaultChecked }) => {
        manager.addService({
            model,
            client,
            isDefaultChecked
        });
    });
    return manager;
};

// Initialize services and export the manager
await initializeServices();
export default manager;
