// module.exports = {
//     findOneByID: findOneByID(IDf)
// }

const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
const uri = "mongodb+srv://loter:3YC2UQyP8xec@cluster0.rsedv.mongodb.net/users?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function start()
{
    await client.connect();
}

async function getUserByID(IDf) {
    let a;
    try {
        // await client.connect();
        console.log("connection done");

        const db = client.db("usersdb");
        const collection = db.collection("users");

        a = await collection.findOne({ id: IDf });

    }
    finally {
        // await client.close();
        return a;
    }
}

async function findAllMatched(user) {
    let a = [], i = 0;
    try {
        await client.connect();
        const database = client.db("usersdb");
        const collection = database.collection("users");
        let atrib = { active: true };
        if (user.looking_for == 'both') {
            atrib = { id: {$ne : user.id } , active: true, $or: [{ looking_for: 'both' }, { looking_for: user.gender }] };
        }
        else {
            atrib = { active: true, gender: user.looking_for, $or: [{ looking_for: 'both' }, { looking_for: user.gender }] };
        }
        const cursor = collection.find(atrib);
        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        await cursor.forEach(element => {
            a[i] = element;
            i++;
        });
    } finally {
        //await client.close();
        return a;
    }
}

async function updateData(userUpdated) {
    try {
        // await client.connect();
        const database = client.db("usersdb");
        const collection = database.collection("users");
        // create a filter for a movie to update
        const filter = { id: userUpdated.id };
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets the plot of the movie
        const updateDoc = {
            $set: {
                id: userUpdated.id,
                active: userUpdated.active,
                name: userUpdated.name,
                login: userUpdated.login,
                age: userUpdated.age,
                gender: userUpdated.gender,
                looking_for: userUpdated.looking_for,
                description: userUpdated.description,
                photo: userUpdated.photo,
                history: userUpdated.history
            },
        };
        const result = await collection.updateOne(filter, updateDoc, options);
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
    } finally {
        // await client.close();
    }
}

async function show() {
    try {
    //   await client.connect();
      const database = client.db("usersdb");
      const collection = database.collection("users");
      // query for movies that have a runtime less than 15 minutes
      const query = { runtime: { $lt: 15 } };
      const options = {
        // sort returned documents in ascending order by title (A->Z)
        sort: { title: 1 },
      // Include only the title and imdb fields in each returned document
        projection: { _id: 0, title: 1, imdb: 1 },
      };
      const cursor = collection.find();
      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      // replace console.dir with your callback to access individual elements
      await cursor.forEach(console.dir);
    } finally {
    //   await client.close();
    }
  }

module.exports = { getUserByID, updateData, findAllMatched , show, start}

// let b = findOneByID("Alex");

// b.then(function (result) {
//     console.log("Promise: ")
//     console.log(result);
// })


