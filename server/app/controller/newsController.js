const News = require('../model/newsModel');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs')
const path = require('path')
const React = require('react')

exports.getAllNews = (params, returnFunction) => {
    News.find().sort({[params.sort]: params.order}).exec((err, news) => {
        if (err) {
            returnFunction({
                status: "error",
                message: err,
            });
        }
        returnFunction({
            status: "success",
            message: "News retrieved successfully",
            payload: news
        });
    })
};

exports.new = (newsData, returnFunction) => {
    {
        let news = new News();
        news.title = newsData.title;
        news.content = newsData.content;
        news.author = newsData.email;
        console.log(news.title, news.content, news.author, "news")
        news.save((err) => {
            if(err){
                console.log(err)
                console.log("ERROR")
            }
            returnFunction({
                message: 'New news created!',
                payload: news
            });
        });
    }
};

exports.getById = (id, returnFunction) => {
    if (!ObjectId.isValid(id)) {
        returnFunction({status: 400});
    }
    News.findById(id, (err, news) => {
        if (err) {
            returnFunction({
                status: 400,
                payload: {err}
            })
        }
        returnFunction({
            status: 200,
            payload: news
        });
    });
};

exports.getIcon = (request, response) => {
    const fileName = path.resolve(`./server/app/icons/${request.params.name}`);
    if(!fs.existsSync(fileName)){
        console.log(fileName);
        return response.status(500).send("This icon is missing on the server");
    }
    response.sendFile(fileName);
};

exports.update = (newsForUpdate, returnFunction) => {
    console.log(newsForUpdate);
    let id = newsForUpdate._id;
    if (!ObjectId.isValid(id)) {
        return({
            message: 'Bad id.'
        });
    }

    console.log("here2");
    News.findById(id, (err, news) => {
        console.log("here3");
        console.log("here", err, news)
        if (err) {
            return(err);
        }
        const likes = news.likes;
        news.title = newsForUpdate.title ? newsForUpdate.title : news.title;
        news.content = newsForUpdate.content ? newsForUpdate.content : news.content;
        news.likes = newsForUpdate.likes ? newsForUpdate.likes : news.likes;

        if(newsForUpdate.favoriteEmail){
            console.log(news)
            if(!news.favorites){
                news.favorites = [];
            }

            if(!news.favorites.includes(newsForUpdate.favoriteEmail)){
                news.favorites.push(newsForUpdate.favoriteEmail);
            }
            else{
                news.favorites = news.favorites.filter(e => e !== newsForUpdate.favoriteEmail);
            }
        }

        if(!news.author){
            news.author = newsForUpdate.email ? newsForUpdate.email : news.author;
        }

        console.log(likes, news.likes, newsForUpdate.likes, newsForUpdate.email, "like!")
        if(likes !== newsForUpdate.likes &&
            news.likedUsers.includes(newsForUpdate.email)){
            news.likes = likes - 1;
            news.likedUsers = news.likedUsers.filter(e => e !== newsForUpdate.email);
        }
        else if(likes !== newsForUpdate.likes){
            if(news.likedUsers){
                news.likedUsers.push(newsForUpdate.email)
            }
            else{
                news.likedUsers = [newsForUpdate.email]
            }
        }

        if(newsForUpdate.comment){
            news.comments.push(newsForUpdate.comment);
        }
        news.save((err) => {
            if (err) {
                console.log(err)
                return(err);
            }
            returnFunction({
                message: 'News Info updated',
                payload: news
            });
        });
    });
};


exports.delete = function (news_id, returnFunction) {
    let id = news_id;
    if (!ObjectId.isValid(id)) {
        returnFunction({
            message: 'Bad id.'
        });
        return;
    }
    News.deleteOne({
        _id: id
    }, (err, news) => {
        if (err)
            returnFunction(err);
        returnFunction({
            status: "success",
            message: 'Contact deleted'
        });
    });
};
