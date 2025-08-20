import { MongoMemoryReplSet } from 'mongodb-memory-server'

let memoryDB: MongoMemoryReplSet | undefined = undefined

export async function getMemoryDB() {
  if (memoryDB) {
    return memoryDB
  }

  memoryDB = await MongoMemoryReplSet.create({
    replSet: {
      count: 3,
      dbName: 'payloadmemory',
    },
  })

  return memoryDB
}
