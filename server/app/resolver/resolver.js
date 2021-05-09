const Posts = require('../model/newsModel');
const ObjectId = require('mongoose').Types.ObjectId;
const {GraphQLUpload} = require('graphql-upload');

const resolver = {
    FileUpload: GraphQLUpload,
    posts: () => {
        console.log("we are here in posts")
        const data = Posts.find().then(post => {
            console.log(post);
            post.comments = post.comments && post.comments.map(c => c.date = Date.parse(c.date.toString()).toString())
            return post
        }).catch(err => {
            console.log("error",err);
            return err
        });
        console.log(data);
        return data;
    },
    onePost: (args) => {
        return Posts.findById({_id: new ObjectId(args.postId)}).then(post => post).catch(err => err)
    },
    createPost: (args, context) => {
        console.log("we are in create post", args);
        let news = new Posts();
        news.title = args.title;
        news.content = args.content;
        news.author = args.email;
        console.log(news, "news");
        return Posts.create(news).then((post) => {
            return post;
        }).catch(err => {
            console.log(err)
            return err
        });
    },
    updatePost: (args, context) => {
        console.log("update", args);
        return Posts.findById({_id: new ObjectId(args.postId)}).then(post => {
            post.title = args.title;
            post.content = args.body;
            post.save();
        }).catch(err => console.log(err));
    },
    addComment: (args, context) => {
        console.log("comment", args);
        return Posts.findById({_id: new ObjectId(args.postId)}).then(post => {
            post.comments.push({
                date: Date.now().toString(),
                content: args.body,
                author: args.email
            });
            return post.save();
        }).catch(err => console.log(err));
    },
    deletePost: (args) => {
        console.log("we are in delete post");
        console.log(args);
        return Posts.findOneAndDelete({_id: new ObjectId(args.postId)})
    },
    addPostLike: (args, context) => {
        console.log("we are in post like", args);
        return Posts.findById(new ObjectId(args.postId)).then(post => {
            if (post) {
                if(post.likedUsers && post.likedUsers.includes(args.email)){
                    post.likes = post.likes - 1;
                    post.likedUsers = post.likedUsers.filter(e => e !== args.email);
                }else{
                    if(post.likedUsers){
                        post.likedUsers.push(args.email)
                    }
                    else{
                        post.likedUsers = [args.email]
                    }
                    post.likes++;
                }
                return post.save();
            }
        })
    },
    addToFavorites: (args, context) => {
        console.log("we are in favorites");
        return Posts.findById(new ObjectId(args.postId)).then(news => {
            if (news) {
                if(!news.favorites){
                    news.favorites = [];
                }
                if(!news.favorites.includes(args.email)){
                    news.favorites.push(args.email);
                }
                else{
                    news.favorites = news.favorites.filter(e => e !== args.email);
                }
                return news.save();
            }
        })
    },
    deletePostLike: (args, context) => {
        return Posts.findById(new ObjectId(args.postId)).populate('likes')
            .then(post => {
                let currentUserId = context.user._id;
                if (post) {
                    let likeIndex = post.likes.findIndex(user => user['_id'].equals(currentUserId))
                    if (likeIndex !== -1) {
                        post.likes.splice(likeIndex, 1);
                    }
                    return post.save();
                }
            })
            .catch(err => err);

    }
};
module.exports = resolver;
