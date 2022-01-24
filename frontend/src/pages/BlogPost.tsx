import Api from 'api'
import { AxiosResponse } from 'axios'
import BlogPostBody from 'components/BlogPostBody'
import { IBlogPost } from 'model'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Header, Loader } from 'semantic-ui-react'

export default function (): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = React.useState<IBlogPost | undefined>()
  const [loading, setLoading] = React.useState<boolean>(false)
  React.useEffect(() => {
    Api.getBlogPost(id).then((res: AxiosResponse<IBlogPost>) => {
      setPost(res.data)
      setLoading(false)
    })
  }, [])

  if (loading || !post) {
    return (
      <Container>
        <Loader />
      </Container>
    )
  }
  return (
    <Container>
      <Header as="h1">{post.title}</Header>
      <div>{post ? <BlogPostBody contents={post.body} /> : <Loader />}</div>
    </Container>
  )
}
