import { _database } from 'database'
import { FindOneOptions, ObjectID, ObjectId } from 'mongodb'
import { model, Schema } from 'orm'



export const BlogPostModel = model(
  'BlogPost',
  new Schema({
    title: String,
    body: String,
    category: [String],
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

export const BlogPostCategoryModel = model(
  'BlogPostCategory',
  new Schema({
    name: String,
    ordering: Number
  })
)