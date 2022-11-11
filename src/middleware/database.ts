// mongodb.js

import { MongoClient } from 'mongodb'

const uri = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@
${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/?authSource=admin
&readPreference=primary&directConnection=true&ssl=false`
const options: any = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

let client
let clientPromise:any

// if (!process.env.MONGODB_URI) {
//     throw new Error('Add Mongo URI to .env.local')
// }

client = new MongoClient(uri, options)
clientPromise = client.connect()


export default clientPromise