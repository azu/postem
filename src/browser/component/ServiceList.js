// LICENSE : MIT
"use strict";
import React from "react"
export default class ServiceList extends React.Component {
    render() {
        const enabledServices = this.props.enabledServices;
        const {enableService, disableService} = this.props;
        const serviceList = this.props.services.map(service => {
            if (enabledServices.indexOf(service.id) !== -1) {
                return <li key={service.id} className="Service--enable"
                           onClick={disableService.bind(this, service)}><img className="Service-icon" src={service.icon}
                                                                             alt={service.name}/></li>;
            } else {
                return <li key={service.id} className="Service--disable"
                           onClick={enableService.bind(this, service)}><img className="Service-icon" src={service.icon}
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