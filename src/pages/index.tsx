import * as React from "react"
import { HeadFC, Link, PageProps, graphql } from "gatsby"
import { CardList, Footer, Logo } from "@fabiofognani/ui-library";

const IndexPage: React.FC<PageProps<Queries.HomePageQueryQuery>> = ({ data }) => {
  const { site, allContentfulPageBlogPost } = data;
  return (
    <main className="p-4">
      <Logo name="HSD" />
      <h1 className="font-bold text-xl">
        {site?.siteMetadata?.title}
      </h1>
      <CardList title="ciao" />
      <ul>
        {allContentfulPageBlogPost?.nodes.map(node => (<li>
          <Link to={`/blog/${node.id}`}>
            {node.title}
          </Link>
        </li>))}
      </ul>
      <Footer />
      
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
  return <title>Home | {site?.siteMetadata?.title}</title>
}
