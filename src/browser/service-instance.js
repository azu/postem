// LICENSE : MIT
"use strict";
// service
import {Client as HatenaClient, Model as HatenaModel} from "../services/hatebu/index";
import {Client as JSerClient, Model as JSerModel} from "../services/jser.info";
import {Client as DebugClient, Model as DebugModel} from "../services/debug";
import {Client as TwitterClient, Model as TwitterModel} from "../services/twitter";
import ServiceManger from "./service-manager";
const manager = new ServiceManger();
manager.addService(new TwitterModel(), new TwitterClient());
manager.addService(new HatenaModel(), new HatenaClient());
manager.addService(new JSerModel(), new JSerClient());
manager.addService(new DebugModel(), new DebugClient());
export default manager;