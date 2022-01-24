import Nav from 'components/Nav'
import Admin from 'pages/Admin'
import BlogList from 'pages/BlogList'
import BlogPost from 'pages/BlogPost'
import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'

export default function (): React.ReactElement {
  return (
    <Container fluid style={{ marginTop: '2em' }}>
      <BrowserRouter>
        <Container>
          <Nav />
        </Container>
        <Switch>
          <Route exact path="/">
            <BlogList />
          </Route>
          <Route exact path="/posts/c/:category">
            <BlogList />
          </Route>
          <Route exact path="/posts">
            <BlogList />
          </Route>
          <Route exact path="/blog/:id">
            <BlogPost />
          </Route>
          <Route exact path="/admin/">
            <Admin />
          </Route>
        </Switch>
      </BrowserRouter>
    </Container>
  )
}
