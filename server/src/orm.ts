import { _database } from 'database'
import { FindOneOptions, ObjectID, ObjectId } from 'mongodb'

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

type IFieldType = StringConstructor | NumberConstructor | DateConstructor | BooleanConstructor | [StringConstructor] | [NumberConstructor]
interface IFieldSpec {
  type: IFieldType
  unique?: boolean
  default?: any
  optional?: boolean
}

interface ISchemaSpec {
  [fieldName: string]: ISchemaSpec | IFieldSpec | IFieldType
}

export class Schema {
  schema: ISchemaSpec
  _validationErrors: string[] = []

  static _isPrimitiveConstructor(val: any) {
    return ([String, Number, Boolean, Date] as any[]).includes(val)
  }

  constructor(schema: ISchemaSpec) {
    this.schema = schema
  }

  validate(obj: { [k: string]: any }) {
    Object.entries(this.schema).forEach(([name, def]) => {
      try {
        const isOptionalField = typeof def === 'object' && !(def instanceof Array) && def.optional == true
        if (!(name in obj)) {
          if (!isOptionalField) throw new ValidationError(`Required field '${name} missing`)
          else {
            if (typeof def === 'object' && def.default !== undefined) {
              obj[name] = def.default
            } else {
              return
            }
          }
        }

        const val = obj[name]
        let type: StringConstructor | NumberConstructor | DateConstructor | BooleanConstructor | IFieldSpec | ISchemaSpec;
        let isArray = false
        if (typeof def === 'object' && !(def instanceof Array)) {
          if (def.type instanceof Array) type = def.type[0]
          else type = def.type 
        } else if (def instanceof Array) {
          type = def[0]
          isArray = true
        } else {
          type = def
        }

        if (Schema._isPrimitiveConstructor(type) && typeof type === 'function') {
          let valueHasValidType
          // eslint-disable-next-line @typescript-eslint/ban-types
          if (type == Date) {
            valueHasValidType = val instanceof Date
          } else if (isArray) {
            if (val instanceof Array) {
              valueHasValidType = val.every((v) => typeof v === typeof (type as Function)())
            }
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-types
            valueHasValidType = typeof val === typeof (type as Function)()
          }
          if (!valueHasValidType) {
            throw new ValidationError(
              // eslint-disable-next-line @typescript-eslint/ban-types
              `Invalid type for field '${name}'(type ${typeof (type as Function)}): ${typeof val}`
            )
          }
        } else {
          throw new Error('Not implemented')
        }
      } catch (e) {
        if (e instanceof ValidationError) {
          this._validationErrors.push(e.message)
        } else {
          throw e
        }
      }
    })
    if (this._validationErrors.length > 0) {
      return false
    } else return true
  }
}

export function model(name: string, schema: Schema) {
  class ModelClass {
    [prop: string]: any
    _modelName: string
    static _schema: Schema = schema
    _id: ObjectId

    constructor() {
      this._modelName = name
    }

    static _toModel(object: Record<string, unknown>): ModelClass {
      if (!object) return null
      const model = new ModelClass()
      Object.entries(object).forEach(([k, v]) => {
        model[k] = v
      })
      return model
    }

    static getCollection() {
      if (!_database) {
        throw new Error('Database not initialized')
      }
      return _database.collection(name)
    }

    static async findOne(query: Record<string, unknown>) {
      const object = await ModelClass.getCollection().findOne(query)
      return ModelClass._toModel(object)
    }

    static async find(query: Record<string, unknown>, options: FindOneOptions) {
      const objects = await ModelClass.getCollection().find(query, options).toArray()
      return objects.map((o) => ModelClass._toModel(o))
    }

    static async insert(data: Record<string, unknown>) {
      Object.entries(ModelClass._schema.schema).forEach(async ([fieldName, fieldSpec]) => {
        if (typeof fieldSpec === 'object' && !(fieldSpec instanceof Array) && fieldSpec.unique && data[fieldName]) {
          if (await ModelClass.getCollection().findOne({ [fieldName]: data[fieldName] })) {
            throw new Error(`Unique key constraint (${fieldName}=${data[fieldName]})`)
          }
        }
      })
      return await ModelClass.getCollection().insertOne(data)
    }
    static async update(id: ObjectId, data: Record<string, unknown>) {
      // TODO use $set query
      return ModelClass.getCollection().replaceOne({ _id: id }, data)
    }

    toString() {
      return `${this._modelName} model instance\n` + JSON.stringify(this._toObject())
    }

    toJson() {
      const obj = this._toObject()
      obj._id = new ObjectID(obj._id)
      return obj
    }

    _toObject() {
      const obj: { [k: string]: any } = {}
      if (this._id) obj._id = this._id
      if (this.createdAt) obj.createdAt = this.createdAt
      if (this.updatedAt) obj.updatedAt = this.updatedAt

      Object.entries(schema.schema).forEach(([fieldName]) => {
        if (fieldName in this) obj[fieldName] = this[fieldName]
      })
      return obj
    }

    async reload() {
      const object = await ModelClass.getCollection().findOne({ _id: this._id })
      Object.entries(object).forEach(([k, v]) => {
        this[k] = v
      })
      return this
    }

    patch(data: Record<string, unknown>) {
      Object.entries(data).forEach(([k, v]) => {
        this[k] = v
      })
    }

    async getDiff() {
      const current = this._toObject()
      const persisted = await ModelClass.findOne({ _id: current._id })
      const diff: { [k: string]: any } = {}
      Object.entries(current).forEach(([k, v]) => {
        if (current[k] !== persisted[k]) {
          diff[k] = v
        }
      })
      return diff
    }

    async save() {
      const plainObject = this._toObject()
      if (ModelClass._schema.validate(plainObject)) {
        if (!this._id) {
          plainObject.createdAt = new Date()
          plainObject.updatedAt = plainObject.createdAt
          // TODO cheating for now, use current model instead of hard-coding BlogPostModel
          const res = await ModelClass.insert(plainObject)
          if (res.insertedCount < 1) throw new Error("Error insertin' document, partner")
          this._id = res.insertedId
          return this
        } else {
          this.updatedAt = new Date()
          const update = await this.getDiff()
          await ModelClass.update(this._id, { $set: update })
        }
      } else {
        throw Error('Validation errors: ' + this._schema._validationErrors.join(', '))
      }
    }
  }

  return ModelClass
}

export const BlogPostModel = model(
  'BlogPost',
  new Schema({
    title: String,
    body: String,
    slug: {
      type: String,
      unique: true,
    },
    blurb: String,
    imageUrl: {
      type: String,
      optional: true,
    },
    publishedAt: {
      type: Date,
      optional: true,
    },
    published: {
      type: Boolean,
      default: false,
      optional: true,
    },
  })
)
