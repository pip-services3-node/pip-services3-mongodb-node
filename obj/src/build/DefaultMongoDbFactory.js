"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MongoDbConnection_1 = require("../persistence/MongoDbConnection");
/**
 * Creates MongoDb components by their descriptors.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[MongoDbConnection]]
 */
class DefaultMongoDbFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultMongoDbFactory.MongoDbConnectionDescriptor, MongoDbConnection_1.MongoDbConnection);
    }
}
exports.DefaultMongoDbFactory = DefaultMongoDbFactory;
DefaultMongoDbFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "mongodb", "default", "1.0");
DefaultMongoDbFactory.MongoDbConnectionDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "connection", "mongodb", "*", "1.0");
//# sourceMappingURL=DefaultMongoDbFactory.js.map