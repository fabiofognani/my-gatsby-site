import * as React from "react"
import { HeadFC, Link, PageProps, graphql } from "gatsby"

const IndexPage: React.FC<PageProps<Queries.HomePageQueryQuery>> = ({ data }) => {
  const { site, allContentfulPageBlogPost } = data;

  return (
    <main className="p-4">
      <h1 className="font-bold text-xl">
        {site?.siteMetadata?.title}
      </h1>
      <ul>
        {allContentfulPageBlogPost?.nodes.map(node => (<li>
          <Link to={`/blog/${node.id}`}>
            {node.title}
          </Link>
        </li>))}
      </ul>
    </main>
  )
}

export default IndexPage

export const query = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulPageBlogPost {
      nodes {
        id
        title
      }
    }
  }
`

export const Head: HeadFC<Queries.HomePageQueryQuery> = ({ data }) => {
  const { site } = data;
  return <title>Home Page | {site?.siteMetadata?.title}</title>
}
