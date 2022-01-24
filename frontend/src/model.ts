export interface IBlogPost {
  _id: string
  body: string
  slug: string
  title: string
  imageUrl: string
  blurb: string
  published?: boolean
  publishedAt?: Date
  createdAt?: Date
}
