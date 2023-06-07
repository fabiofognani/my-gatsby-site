import * as React from "react"
import { HeadFC, PageProps, graphql } from "gatsby"

const IndexPage: React.FC<PageProps<Queries.HomePageQueryQuery>> = ({ data }) => {
  const { site } = data;

  return (
    <main className="p-4">
      <h1 className="font-bold text-xl">
        {site?.siteMetadata?.title}
      </h1>
      <h2 className="text-lg">42</h2>
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
  }
`

export const Head: HeadFC<Queries.HomePageQueryQuery> = ({ data }) => {
  const { site } = data;
  return <title>Home | {site?.siteMetadata?.title}</title>
}
