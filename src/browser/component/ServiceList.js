// LICENSE : MIT
"use strict";
import React from "react"
export default class ServiceList extends React.Component {
    render() {
        const enabledServices = this.props.enabledServices;
        const {enableService, disableService, login} = this.props;
        const onEnable = (service, event) => {
            if (event.shiftKey) {
                login(service);
            } else {
                enableService(service);
            }
        };
        const onDisable = (service) => {
            disableService(service)
        };
        const serviceList = this.props.services.map(service => {
            if (enabledServices.indexOf(service.id) !== -1) {
                return <li key={service.id} className="Service--enable"
                           onClick={onDisable.bind(this, service)}><img className="Service-icon" src={service.icon}
                                                                        alt={service.name}/></li>;
            } else {
                return <li key={service.id} className="Service--disable"
                           onClick={onEnable.bind(this, service)}><img className="Service-icon" src={service.icon}
                                                                       alt={service.name}/></li>;
            }
        });
        return <div className="ServiceList">
            <ul>
                {serviceList}
            </ul>
        </div>
    }
}