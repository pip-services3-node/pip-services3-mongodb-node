/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { MongoDbConnection } from '../persistence/MongoDbConnection';

/**
 * Creates MongoDb components by their descriptors.
 * 
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[MongoDbConnection]]
 */
export class DefaultMongoDbFactory extends Factory {
	public static readonly Descriptor: Descriptor = new Descriptor("pip-services", "factory", "mongodb", "default", "1.0");
    public static readonly MongoDbConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "mongodb", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultMongoDbFactory.MongoDbConnectionDescriptor, MongoDbConnection);
    }
}
