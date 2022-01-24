import { MongoClient, Db } from 'mongodb'
export let _database: Db | undefined

export async function initializeDB(): Promise<Db> {
  const client = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true })
  const con = await client.connect()
  _database = await con.db()
  return _database
}
