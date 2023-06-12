import * as React from "react"
import { HeadFC, PageProps, graphql } from "gatsby"

const BlogPost: React.FC<PageProps<Queries.BlogPostQueryQuery>> = ({ data }) => {
  return (
    <main className="p-4">
      <h1 className="font-bold text-xl">
        {data?.contentfulPageBlogPost?.title}
      </h1>
    </main>
  )
}

export default BlogPost

export const query = graphql`
  query BlogPostQuery ($id: String) {
    contentfulPageBlogPost (id: { eq: $id }) {
      title
      id
    }
  }
`

export const Head: HeadFC<Queries.BlogPostQueryQuery> = ({ data }) => {
  return <title>{data?.contentfulPageBlogPost?.title}</title>
}
