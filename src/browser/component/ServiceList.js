// LICENSE : MIT
import React from "react";

export default function ServiceList({ services, enabledServices, enableService, disableService, login }) {
    const onEnable = (service, event) => {
        console.log({
            shiftKey: event.shiftKey
        });
        if (event.shiftKey) {
            login(service);
        } else {
            enableService(service);
        }
    };

    const onDisable = (service) => {
        disableService(service);
    };

    const serviceList = services.map((service) => {
        if (enabledServices.indexOf(service.id) !== -1) {
            return (
                <li key={service.id} className="Service--enable" onClick={() => onDisable(service)}>
                    <img className="Service-icon" src={service.icon} alt={service.name} />
                </li>
            );
        } else {
            return (
                <li key={service.id} className="Service--disable" onClick={(e) => onEnable(service, e)}>
                    <img className="Service-icon" src={service.icon} alt={service.name} />
                </li>
            );
        }
    });

    return (
        <div className="ServiceList">
            <ul>{serviceList}</ul>
        </div>
    );
}
