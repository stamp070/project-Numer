const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://stamp:21Stamp1234@testdb.cpfssms.mongodb.net/?retryWrites=true&w=majority&appName=TestDB";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const start = async () => {
  await client.connect();
};

const disconnect = async () => {
  await client.close();
};

async function loadDataFromDatabase(topic, subTopic, limit) {
  try {
    const admin = client.db().admin();
    const databases = await admin.listDatabases();
    const dbExists = databases.databases.some((db) => db.name === topic);

    // Check if the databases already exists
    if (!dbExists) {
      throw `Database ${topic} does not exist.`;
    }

    const database = client.db(topic);

    // Check if the collection already exists
    const collections = await database
      .listCollections({ name: subTopic })
      .toArray();
    if (collections.length === 0) {
      throw `Collection ${subTopic} does not exist.`;
    }

    const collection = database.collection(subTopic);

    const randomData = await collection
      .aggregate([{ $sample: { size: limit } }])
      .toArray();
    if (randomData.length > 0) {
      return randomData;
    } else {
      throw "No data found in the collection.";
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  loadDataFromDatabase,
  start,
  disconnect,
};
