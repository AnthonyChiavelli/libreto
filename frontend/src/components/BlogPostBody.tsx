import { h } from 'hastscript/html.js'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import directive from 'remark-directive'
import 'semantic-ui-css/semantic.min.css'
import { visit } from 'unist-util-visit'

interface IBlogPostBody {
  contents: string
}

// Plugin to allow custom directives (`:graph[My Graph]{points=[1, 2, 3]}`) which can be mapped to react components
const htmlDirectives = () => {
  function ondirective(node: any) {
    const data = node.data || (node.data = {})
    const hast = h(node.name, node.attributes)

    data.hName = node.name
    data.hProperties = (hast as any).properties
  }

  function transform(tree: any) {
    visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], ondirective)
  }

  return transform
}

const YoutubeVideo = ({ embedId }: { embedId: string }) => {
  return (
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  )
}

export default function ({ contents }: IBlogPostBody): React.ReactElement {
  return (
    <ReactMarkdown
      children={contents}
      skipHtml={true}
      // @ts-expect-error: Custom plugin passes props to components that react-markdown does not expect
      components={{ video: YoutubeVideo }}
      remarkPlugins={[directive, htmlDirectives]}
    />
  )
}
