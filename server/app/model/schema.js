const {buildSchema} = require('graphql');

const schema = buildSchema(`
scalar FileUpload

 type Query {
  posts: [Post!]!
  onePost(postId: String!): Post
 }
 type Mutation {
  createPost(title: String!,content: String!,email: String!): Post!
  updatePost(postId: String!, title: String, body: String): Post!
  addComment(postId: String!, email: String!, body: String!): Post!
  deletePost(postId: String!):Post
  addPostLike(postId: String!, email: String!): Post!
  addToFavorites(postId: String!, email: String!): Post!
  deletePostLike(postId: String!): Post!
  }
  
    type Post {
    id: ID!
    title: String!
    content: String!
    likes: String
    likedUsers: [String]
    author: String!
    favorites: [String]
    comments: [Comments]
  }
  
  type Comments {
  id: ID! 
  date: String! 
  content: String! 
  author: String! 
  }
 
  
type User {
    id: ID!
    name: String
    email: String
  }
`);

module.exports = schema;
