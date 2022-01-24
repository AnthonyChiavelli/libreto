import Api from 'api'
import BlogPostBody from 'components/BlogPostBody'
import { IBlogPost } from 'model'
import moment from 'moment'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button, Checkbox, Container, Form, Grid, Header, Loader, Segment, Table, TableRow } from 'semantic-ui-react'

const getBlankPost = (): Partial<IBlogPost> => {
  return {
    title: 'New Draft',
    body: '',
    blurb: '',
    slug: '',
    published: false,
  }
}

export default function (): React.ReactElement {
  const [posts, setPosts] = React.useState<IBlogPost[]>([])
  const [activePost, setActivePost] = React.useState<IBlogPost | undefined>()
  const [activeDraft, setActiveDraft] = React.useState<Partial<IBlogPost>>(getBlankPost())
  const [loading, setLoading] = React.useState<boolean>(false)

  const handleReloadDraft = React.useCallback(() => {
    setActiveDraft({ ...activePost })
  }, [activePost])
  const openPost = React.useCallback((post: IBlogPost) => {
    setActivePost(post)
    setActiveDraft({ ...post })
  }, [])

  const updatePost = React.useCallback(
    (field: string, value: string | boolean) => {
      setActiveDraft({ ...activeDraft, [field]: value })
    },
    [activeDraft]
  )

  const handleSubmit = React.useCallback(() => {
    if (activeDraft._id) {
      Api.updateBlogPost(activeDraft._id, activeDraft)
        .then((res) => {
          toast('Post Updated', { type: 'success' })
          setActivePost(res.data)
        })
        .catch(() => {
          toast('Update Failed', { type: 'error' })
        })
    } else {
      Api.createBlogPost(activeDraft)
        .then((res) => {
          toast('Post Updated', { type: 'success' })
          setActivePost(res.data)
        })
        .catch(() => {
          toast('Update Failed', { type: 'error' })
        })
    }
  }, [activeDraft])

  const draftIsClean = React.useMemo(() => {
    const keys: Array<keyof Partial<IBlogPost>> = ['title', 'body', 'published', 'blurb', 'slug']
    return keys.every((field) => activeDraft && activePost && activeDraft[field] === activePost[field])
  }, [activePost, activeDraft])

  React.useEffect(() => {
    setLoading(true)
    Api.getBlogPosts('all').then((res) => {
      setLoading(false)
      setPosts(res.data)
    })
  }, [])

  if (loading) {
    return (
      <Container>
        <Loader active />
      </Container>
    )
  }
  return (
    <Container fluid style={{ paddingLeft: '1em', paddingRight: '2em' }}>
      <ToastContainer />
      <Grid>
        <Grid.Column width={10}>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>Post Title</label>
              <input
                required
                placeholder="Title"
                value={activeDraft?.title}
                onChange={(e) => updatePost('title', e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Blurb</label>
              <input
                placeholder="Blurb"
                required
                value={activeDraft?.blurb}
                onChange={(e) => updatePost('blurb', e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Slug</label>
              <input
                required
                placeholder="Slug"
                value={activeDraft?.slug}
                onChange={(e) => updatePost('slug', e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>Content</label>
              <textarea
                required
                rows={40}
                placeholder="Contents"
                value={activeDraft?.body}
                onChange={(e) => updatePost('body', e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                label="Published"
                checked={activeDraft?.published}
                onChange={(e, d) => updatePost('published', d.checked)}
              />
            </Form.Field>
            <div>
              <Button disabled={draftIsClean} type="submit">
                Update
              </Button>
              <Button disabled={draftIsClean} onClick={handleReloadDraft}>
                Revert
              </Button>
            </div>
          </Form>
        </Grid.Column>
        <Grid.Column width={6}>
          <PostTable posts={posts} onOpenPost={openPost} selectedPostId={activePost?._id} />
          <Container fluid>
            <Header as="h3">Preview</Header>
            <Segment>
              <BlogPostBody contents={activeDraft?.body} />
            </Segment>
          </Container>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

interface IPostTableProps {
  posts: IBlogPost[]
  selectedPostId: string | undefined
  onOpenPost: (p: Partial<IBlogPost>) => void
}

const PostTable = ({ posts, onOpenPost, selectedPostId }: IPostTableProps) => {
  return (
    <Table selectable>
      <Table.Header>
        <Table.HeaderCell>Title</Table.HeaderCell>
        <Table.HeaderCell>Created At</Table.HeaderCell>
        <Table.HeaderCell>Published At</Table.HeaderCell>
        <Table.HeaderCell>Published</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {posts.map((p) => (
          <TableRow positive={p._id == selectedPostId} key={p._id} onClick={() => onOpenPost(p)}>
            <Table.Cell>{p.title}</Table.Cell>
            <Table.Cell>{moment(p.createdAt).format('MM/DD/YYYY, h:mm:ss a')}</Table.Cell>
            <Table.Cell>{moment(p.publishedAt).format('MM/DD/YYYY, h:mm:ss a')}</Table.Cell>
            <Table.Cell>{p.published ? 'Yes' : 'No'}</Table.Cell>
          </TableRow>
        ))}
        <TableRow key={'new'} onClick={() => onOpenPost(getBlankPost())}>
          <Table.Cell>Create Blank Post</Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>No</Table.Cell>
        </TableRow>
      </Table.Body>
    </Table>
  )
}
