"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifiableMongoDbPersistence = void 0;
/** @module persistence */
/** @hidden */
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MongoDbPersistence_1 = require("./MongoDbPersistence");
/**
 * Abstract persistence component that stores data in MongoDB
 * and implements a number of CRUD operations over data items with unique ids.
 * The data items must implement [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/data.iidentifiable.html IIdentifiable]] interface.
 *
 * In basic scenarios child classes shall only override [[getPageByFilter]],
 * [[getListByFilter]] or [[deleteByFilter]] operations with specific filter function.
 * All other operations can be used out of the box.
 *
 * In complex scenarios child classes can implement additional operations by
 * accessing <code>this._collection</code> and <code>this._model</code> properties.

 * ### Configuration parameters ###
 *
 * - collection:                  (optional) MongoDB collection name
 * - connection(s):
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                      host name or IP address
 *   - port:                      port number (default: 27017)
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                 (optional) a key to retrieve the credentials from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                  (optional) user name
 *   - password:                  (optional) user password
 * - options:
 *   - max_pool_size:             (optional) maximum connection pool size (default: 2)
 *   - keep_alive:                (optional) enable connection keep alive (default: true)
 *   - connect_timeout:           (optional) connection timeout in milliseconds (default: 5000)
 *   - socket_timeout:            (optional) socket timeout in milliseconds (default: 360000)
 *   - auto_reconnect:            (optional) enable auto reconnection (default: true)
 *   - reconnect_interval:        (optional) reconnection interval in milliseconds (default: 1000)
 *   - max_page_size:             (optional) maximum page size (default: 100)
 *   - replica_set:               (optional) name of replica set
 *   - ssl:                       (optional) enable SSL connection (default: false)
 *   - auth_source:               (optional) authentication source
 *   - auth_user:                 (optional) authentication user name
 *   - auth_password:             (optional) authentication user password
 *   - debug:                     (optional) enable debug output (default: false).
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 *
 * ### Example ###
 *
 *     class MyMongoDbPersistence extends MongoDbPersistence<MyData, string> {
 *
 *     public constructor() {
 *         base("mydata", new MyDataMongoDbSchema());
 *     }
 *
 *     private composeFilter(filter: FilterParams): any {
 *         filter = filter || new FilterParams();
 *         let criteria = [];
 *         let name = filter.getAsNullableString('name');
 *         if (name != null)
 *             criteria.push({ name: name });
 *         return criteria.length > 0 ? { $and: criteria } : null;
 *     }
 *
 *     public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
 *         callback: (err: any, page: DataPage<MyData>) => void): void {
 *         base.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
 *     }
 *
 *     }
 *
 *     let persistence = new MyMongoDbPersistence();
 *     persistence.configure(ConfigParams.fromTuples(
 *         "host", "localhost",
 *         "port", 27017
 *     ));
 *
 *     persitence.open("123", (err) => {
 *         ...
 *     });
 *
 *     persistence.create("123", { id: "1", name: "ABC" }, (err, item) => {
 *         persistence.getPageByFilter(
 *             "123",
 *             FilterParams.fromTuples("name", "ABC"),
 *             null,
 *             (err, page) => {
 *                 console.log(page.data);          // Result: { id: "1", name: "ABC" }
 *
 *                 persistence.deleteById("123", "1", (err, item) => {
 *                    ...
 *                 });
 *             }
 *         )
 *     });
 */
class IdentifiableMongoDbPersistence extends MongoDbPersistence_1.MongoDbPersistence {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param collection    (optional) a collection name.
     */
    constructor(collection) {
        super(collection);
        if (collection == null)
            throw new Error("Collection name could not be null");
    }
    /**
     * Converts the given object from the public partial format.
     *
     * @param value     the object to convert from the public partial format.
     * @returns the initial object.
     */
    convertFromPublicPartial(value) {
        return this.convertFromPublic(value);
    }
    /**
     * Gets a list of data items retrieved by given unique ids.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @param callback         callback function that receives a data list or error.
     */
    getListByIds(correlationId, ids, callback) {
        let filter = {
            _id: { $in: ids }
        };
        this.getListByFilter(correlationId, filter, null, null, callback);
    }
    /**
     * Gets a data item by its unique id.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @param callback          callback function that receives data item or error.
     */
    getOneById(correlationId, id, callback) {
        let filter = { _id: id };
        this._collection.findOne(filter, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with id = %s", this._collectionName, id);
            else
                this._logger.trace(correlationId, "Retrieved from %s with id = %s", this._collectionName, id);
            item = this.convertToPublic(item);
            callback(err, item);
        });
    }
    /**
     * Creates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @param callback          (optional) callback function that receives created item or error.
     */
    create(correlationId, item, callback) {
        if (item == null) {
            callback(null, null);
            return;
        }
        // Assign unique id
        let newItem = _.omit(item, 'id');
        newItem._id = item.id || pip_services3_commons_node_1.IdGenerator.nextLong();
        super.create(correlationId, newItem, callback);
    }
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    set(correlationId, item, callback) {
        if (item == null) {
            if (callback)
                callback(null, null);
            return;
        }
        // Assign unique id
        let newItem = _.omit(item, 'id');
        newItem._id = item.id || pip_services3_commons_node_1.IdGenerator.nextLong();
        newItem = this.convertFromPublic(newItem);
        let filter = {
            _id: newItem._id
        };
        let options = {
            returnOriginal: false,
            upsert: true
        };
        this._collection.findOneAndReplace(filter, newItem, options, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Set in %s with id = %s", this._collectionName, item.id);
            if (callback) {
                newItem = result ? this.convertToPublic(result.value) : null;
                callback(err, newItem);
            }
        });
    }
    /**
     * Updates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    update(correlationId, item, callback) {
        if (item == null || item.id == null) {
            if (callback)
                callback(null, null);
            return;
        }
        let newItem = _.omit(item, 'id');
        newItem = this.convertFromPublic(newItem);
        let filter = { _id: item.id };
        let update = { $set: newItem };
        let options = {
            returnOriginal: false
        };
        this._collection.findOneAndUpdate(filter, update, options, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Updated in %s with id = %s", this._collectionName, item.id);
            if (callback) {
                newItem = result ? this.convertToPublic(result.value) : null;
                callback(err, newItem);
            }
        });
    }
    /**
     * Updates only few selected fields in a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @param callback          callback function that receives updated item or error.
     */
    updatePartially(correlationId, id, data, callback) {
        if (data == null || id == null) {
            if (callback)
                callback(null, null);
            return;
        }
        let newItem = data.getAsObject();
        newItem = this.convertFromPublicPartial(newItem);
        let filter = { _id: id };
        let update = { $set: newItem };
        let options = {
            returnOriginal: false
        };
        this._collection.findOneAndUpdate(filter, update, options, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Updated partially in %s with id = %s", this._collectionName, id);
            if (callback) {
                newItem = result ? this.convertToPublic(result.value) : null;
                callback(err, newItem);
            }
        });
    }
    /**
     * Deleted a data item by it's unique id.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @param callback          (optional) callback function that receives deleted item or error.
     */
    deleteById(correlationId, id, callback) {
        let filter = { _id: id };
        this._collection.findOneAndDelete(filter, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Deleted from %s with id = %s", this._collectionName, id);
            if (callback) {
                let oldItem = result ? this.convertToPublic(result.value) : null;
                callback(err, oldItem);
            }
        });
    }
    /**
     * Deletes multiple data items by their unique ids.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    deleteByIds(correlationId, ids, callback) {
        let filter = {
            _id: { $in: ids }
        };
        this.deleteByFilter(correlationId, filter, callback);
    }
}
exports.IdentifiableMongoDbPersistence = IdentifiableMongoDbPersistence;
//# sourceMappingURL=IdentifiableMongoDbPersistence.js.map