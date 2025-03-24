import { MongoClient } from "mongodb"

const uri = "mongodb+srv://sahasprajapati54:Sahas0504@cluster0.eqqdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function connectToDatabase() {
  const client = await clientPromise
  return client.db()
}
