import { WordResult } from 'spapi/dictionary'
import { _database } from 'database'
import { InsertOneWriteOpResult } from 'mongodb'

export class SavedWord {
  static collection = 'SavedWord'

  word: string
  notes: string
  definitions: Array<WordResult>
  createdAt: Date

  constructor(word: string, defs: WordResult[], notes: string) {
    this.word = word
    this.definitions = defs
    this.notes = notes
  }

  save(): Promise<InsertOneWriteOpResult<any>> {
    return _database.collection(SavedWord.collection).insertOne({
      definitions: this.definitions,
      word: this.word,
      notes: this.notes,
      createdAt: new Date(),
    })
  }

  static fetchOne(id: string): Promise<any> {
    return _database.collection(this.collection).findOne({ _id: id })
  }

  static fetchAll(): Promise<any[]> {
    return _database.collection(this.collection).find().sort('createdAt', -1).toArray()
  }
}
