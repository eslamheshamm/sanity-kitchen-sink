const { isFuture } = require("date-fns");
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.createSchemaCustomization = ({ actions, schema }) => {
  actions.createTypes([
    schema.buildObjectType({
      name: "SanityPost",
      interfaces: ["Node"],
      fields: {
        isPublished: {
          type: "Boolean!",
          resolve: source => new Date(source.publishedAt) <= new Date()
        }
      }
    })
  ]);
};

async function createLandingPages(pathPrefix = "/", graphql, actions, reporter) {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allSanityRoute(filter: { slug: { current: { ne: null } }, page: { id: { ne: null } } }) {
        edges {
          node {
            id
            slug {
              current
            }
          }
        }
      }
    }
  `);

  if (result.errors) throw result.errors;

  const routeEdges = (result.data.allSanityRoute || {}).edges || [];
  routeEdges.forEach(edge => {
    const { id, slug = {} } = edge.node;
    const path = [pathPrefix, slug.current, "/"].join("");
    reporter.info(`Creating landing page: ${path}`);
    createPage({
      path,
      component: require.resolve("./src/templates/page.js"),
      context: { id }
    });
  });
}

async function createBlogPostPages(pathPrefix = "/blog", graphql, actions, reporter) {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allSanityPost(filter: { slug: { current: { ne: null } }, isPublished: { eq: true } }) {
        edges {
          node {
            id
            publishedAt
            slug {
              current
            }
          }
        }
      }
    }
  `);

  if (result.errors) throw result.errors;

  const postEdges = (result.data.allSanityPost || {}).edges || [];
  postEdges
    .filter(edge => !isFuture(edge.node.publishedAt))
    .forEach(edge => {
      const { id, slug = {} } = edge.node;
      const path = `${pathPrefix}/${slug.current}/`;
      reporter.info(`Creating blog post page: ${path}`);
      createPage({
        path,
        component: require.resolve("./src/templates/blog-post.js"),
        context: { id }
      });
    });
}

async function createPressPostPages(pathPrefix = "/press", graphql, actions, reporter) {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allSanityPress(filter: { slug: { current: { ne: null } } }) {
        edges {
          node {
            id
            publishedAt
            slug {
              current
            }
          }
        }
      }
    }
  `);

  if (result.errors) throw result.errors;

  const postEdges = (result.data.allSanityPress || {}).edges || [];
  postEdges
    .filter(edge => !isFuture(edge.node.publishedAt))
    .forEach(edge => {
      const { id, slug = {} } = edge.node;
      const path = `${pathPrefix}/${slug.current}/`;
      reporter.info(`Creating Press post page: ${path}`);
      createPage({
        path,
        component: require.resolve("./src/templates/press-post.js"),
        context: { id }
      });
    });
}

async function createInterviewsPostPages(pathPrefix = "/interviews", graphql, actions, reporter) {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allSanityInterviews(filter: { slug: { current: { ne: null } } }) {
        edges {
          node {
            id
            publishedAt
            slug {
              current
            }
          }
        }
      }
    }
  `);

  if (result.errors) throw result.errors;

  const postEdges = (result.data.allSanityInterviews || {}).edges || [];
  postEdges
    .filter(edge => !isFuture(edge.node.publishedAt))
    .forEach(edge => {
      const { id, slug = {} } = edge.node;
      const path = `${pathPrefix}/${slug.current}/`;
      reporter.info(`Creating Interviews post page: ${path}`);
      createPage({
        path,
        component: require.resolve("./src/templates/interviews-post.js"),
        context: { id }
      });
    });
}

async function createQuestionsPostPages(pathPrefix = "/questions", graphql, actions, reporter) {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allSanityQuestions(filter: { slug: { current: { ne: null } } }) {
        edges {
          node {
            id
            publishedAt
            slug {
              current
            }
          }
        }
      }
    }
  `);

  if (result.errors) throw result.errors;

  const postEdges = (result.data.allSanityQuestions || {}).edges || [];
  postEdges
    .filter(edge => !isFuture(edge.node.publishedAt))
    .forEach(edge => {
      const { id, slug = {} } = edge.node;
      const path = `${pathPrefix}/${slug.current}/`;
      reporter.info(`Creating Questions post page: ${path}`);
      createPage({
        path,
        component: require.resolve("./src/templates/question-post.js"),
        context: { id }
      });
    });
}
async function createAskPostPages(pathPrefix = "/ask-riad-eid", graphql, actions, reporter) {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allSanityAsk(filter: { slug: { current: { ne: null } } }) {
        edges {
          node {
            id
            publishedAt
            slug {
              current
            }
          }
        }
      }
    }
  `);

  if (result.errors) throw result.errors;

  const postEdges = (result.data.allSanityAsk || {}).edges || [];
  postEdges
    .filter(edge => !isFuture(edge.node.publishedAt))
    .forEach(edge => {
      const { id, slug = {} } = edge.node;
      const path = `${pathPrefix}/${slug.current}/`;
      reporter.info(`Creating Ask post page: ${path}`);
      createPage({
        path,
        component: require.resolve("./src/templates/ask-post.js"),
        context: { id }
      });
    });
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  await createLandingPages("/", graphql, actions, reporter);
  await createBlogPostPages("/blog", graphql, actions, reporter);
  await createPressPostPages("/press", graphql, actions, reporter);
  await createInterviewsPostPages("/interviews", graphql, actions, reporter);
  await createQuestionsPostPages("/questions", graphql, actions, reporter);
  await createAskPostPages("/ask-riad-eid", graphql, actions, reporter);
};
