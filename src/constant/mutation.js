import gql from 'graphql-tag';

export const LIKE = gql`
    mutation AddPostLike($id: String!, $email: String!) {
        addPostLike(postId: $id, email: $email) {
            id
            title
            content
            likes
            likedUsers
            author
            favorites
            comments{
                date
                content 
                author
            }
        }
    }
`;

export const ADD_TO_FAVORITES = gql`
    mutation AddToFavorites($id: String!, $email: String!) {
        addToFavorites(postId: $id, email: $email) {
            id
            title
            content
            likes
            likedUsers
            author
            favorites
            comments{
                date
                content 
                author
            }
        }
    }
`;

export const DIS_LIKE = gql`
    mutation DeletePostLike($id: String!) {
        deletePostLike(postId: $id) {
            id
            title
            content
            likes
            likedUsers
            author
            favorites
            comments{
                date
                content 
                author
            }
        }
    }
`;

export const DELETE_POST = gql`
    mutation DeletePost($id: String!) {
        deletePost (postId:$id) {
            id
            title
            content
            likes
            likedUsers
            author
            favorites
            comments{
                date
                content 
                author
            }
        }
    }
`;
export const CREATE_POST = gql`
    mutation CreatePost($title: String!,$content: String!, $email: String!) {
        createPost(title:$title,content:$content,email:$email) {
            id
            title
            content
            likes
            likedUsers
            author
            favorites
            comments{
                date
                content 
                author
            }
        }

    }
`;

export const UPDATE_POST = gql`
    mutation UpdatePost($id: String!, $title: String, $body: String) {
        updatePost(postId:$id,title:$title,body:$body) {
            id
            title
            content
            likes
            likedUsers
            author
            favorites
            comments{
                date
                content 
                author
            }
        }
    }
`;

export const ADD_COMMENT = gql`
    mutation AddComment($id: String!, $email: String!, $body: String!) {
        addComment(postId:$id,email:$email,body:$body) {
            id
            title
            content
            likes
            likedUsers
            author
            favorites
            comments{
                date
                content 
                author
            }
        }
    }
`;
