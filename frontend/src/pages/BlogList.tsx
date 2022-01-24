import Api from 'api'
import { AxiosResponse } from 'axios'
import { IBlogPost } from 'model'
import moment from 'moment'
import React from 'react'
import queryString from 'query-string'
import { Link, useParams, useLocation } from 'react-router-dom'
import { Button, Container, Header, Image, List } from 'semantic-ui-react'

export default function (): React.ReactElement {
  const [articles, setArticles] = React.useState<IBlogPost[]>([])
  const { category } = useParams<{category: string}>()
  React.useEffect(() => {
    console.log("here")
    Api.getBlogPosts('published', category ).then((res: AxiosResponse<IBlogPost[]>) => {
      setArticles(res.data)
    })
  }, [category])

  return (
    <Container>
      <List>
        {articles.map((a) => (
          <List.Item key={a._id} style={{ marginBottom: 50 }}>
            <Container>
              <Header as={'h2'} style={{ marginBottom: 20 }}>
                {a.title}
              </Header>
              <AuthorAttribution article={a} />
              <Image src={a.imageUrl}></Image>
              <Container style={{ marginBottom: 15 }}>{a.blurb}</Container>
              <Link to={`/blog/${a.slug}`}>
                <Button.Content visible>Read On</Button.Content>
              </Link>
            </Container>
          </List.Item>
        ))}
      </List>
    </Container>
  )
}

function AuthorAttribution({ article }: { article: IBlogPost }) {
  return (
    <Container style={{ marginBottom: 15 }}>
      {moment(article.publishedAt).format('MMM D YYYY')} by Anthony Chiavelli
    </Container>
  )
}
