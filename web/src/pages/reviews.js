import React from "react";
import Layout from "../containers/layout";
import { graphql } from "gatsby";
import { mapEdgesToNodes } from "../lib/helpers";
import ReviewsPostPreviewList from "../components/reviews/reviews-post-preview-list";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";

export const query = graphql`
  query AllReviewsPosts {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
    }
    posts: allSanityReviews(
      sort: { fields: [publishedAt], order: DESC }
      filter: { publishedAt: { ne: null } }
    ) {
      edges {
        node {
          id
          publishedAt
          mainImage {
            ...SanityImage
            alt
          }
          title
          country
          _rawExcerpt
        }
      }
    }
  }
`;
const Reviews = ({ data, errors }) => {
  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    );
  }

  const site = (data || {}).site;
  const postNodes = (data || {}).posts ? mapEdgesToNodes(data.posts) : [];
  if (!site) {
    console.warn(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    );
  }

  return (
    <Layout>
      <SEO
        title={"توصيات"}
        description={"توصیات العملاء للخبیر ریاض عید خبیر تحدید جنس المولود قبل الحمل"}
      />
      <Container>
        <div className="flex flex-col items-center mb-12 ">
          <h1 className="mb-4 text-4xl font-yasser">توصيات</h1>
        </div>
        <div className="my-6 mb-56">
          {postNodes && <ReviewsPostPreviewList nodes={postNodes} />}
        </div>
      </Container>
    </Layout>
  );
};
export default Reviews;
