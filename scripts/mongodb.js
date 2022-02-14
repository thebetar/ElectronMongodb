const { MongoClient, ObjectId } = require('mongodb');

class Connection {
	static uri = 'mongodb://localhost:2400';
	static client = new MongoClient(this.uri);

	static db = null;
	static collections = {};

	static async run() {
		try {
			await this.client.connect();

			this.db = this.client.db('ElectronMongodb');
			(await this.db.listCollections().toArray()).forEach((collection) => {
				this.collections[collection.name] = this.db.collection(collection.name);
			});
		} catch (error) {
			console.error(error);
		}
	}

	static async findAll(collection) {
		return await this.collections[collection].find().toArray();
	}

	static async insert(collection, item) {
		return await this.collections[collection].insertOne(item);
	}

	static async delete(collection, item) {
		return await this.collections[collection].deleteOne({ _id: new ObjectId(item._id) });
	}
}

module.exports = Connection;
