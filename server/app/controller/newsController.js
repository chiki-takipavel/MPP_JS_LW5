import {StaticRouter} from "react-router-dom";

const News = require('../model/newsModel');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs')
const path = require('path')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
import App from "../../../src/App"

exports.getAllNewsPage = (request, response) => {
    console.log("file")
    fs.readFile(path.resolve("./build/index.html"), "utf-8", (error, data) => {
        if(error){
            console.log(error);
            return response.status(500).send("Error on the server!");
        }
        const context = {};
        return response.send(data.replace(
            '<div id="root"></div>',
            `<div id="root">${ReactDOMServer.renderToString(
                <StaticRouter location={request.url} context={context}>
                    <App />
                </StaticRouter>)}</div>`))
    })
};

exports.getAllNews = (request, response) => {
    News.find().sort({[request.query.sort]: request.query.order}).exec((err, news) => {
        if (err) {
            response.json({
                status: "error",
                message: err,
            });
        }
        response.json({
            status: "success",
            message: "News retrieved successfully",
            payload: news
        });
    })
};

exports.new = (request, response) => {
    {
        let news = new News();
        news.title = request.body.title;
        news.content = request.body.content;
        news.author = request.body.email;
        news.save((err) => {
            response.status(200).json({
                message: 'New news created!',
                payload: news
            });
        });
    }
};

exports.getById = (request, response) => {
    let id = request.params.news_id;
    if (!ObjectId.isValid(id)) {
        response.status(400).send({
            message: 'Bad id.'
        });
        return;
    }
    News.findById(id, (err, news) => {
        if (err)
            response.send(err);
        response.status(200).send({
            message: 'News details.',
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

exports.update = (request, response) => {
    let id = request.params.news_id;
    if (!ObjectId.isValid(id)) {
        response.status(400).send({
            message: 'Bad id.'
        });
        return;
    }
    News.findById(id, (err, news) => {
        if (err) {
            response.send(err);
            return;
        }
        const likes = news.likes;
        news.title = request.body.title ? request.body.title : news.title;
        news.content = request.body.content ? request.body.content : news.content;
        news.likes = request.body.likes ? request.body.likes : news.likes;

        if(request.body.favoriteEmail){
            console.log(news)
            if(!news.favorites){
                news.favorites = [];
            }

            if(!news.favorites.includes(request.body.favoriteEmail)){
                news.favorites.push(request.body.favoriteEmail);
            }
            else{
                news.favorites = news.favorites.filter(e => e !== request.body.favoriteEmail);
            }
        }

        if(!news.author){
            news.author = request.body.email ? request.body.email : news.author;
        }

        console.log(likes, news.likes, request.body.likes, request.body.email, "like!")
        if(likes !== request.body.likes &&
            news.likedUsers.includes(request.body.email)){
            news.likes = likes - 1;
            news.likedUsers = news.likedUsers.filter(e => e !== request.body.email);
        }
        else if(likes !== request.body.likes){
            if(news.likedUsers){
                news.likedUsers.push(request.body.email)
            }
            else{
                news.likedUsers = [request.body.email]
            }
        }

        if(request.body.comment){
            news.comments.push(request.body.comment);
        }
        news.save((err) => {
            if (err) {
                console.log(err)
                response.status(400).send(err);
                return;
            }
            response.status(200).send({
                message: 'News Info updated',
                payload: news
            });
        });
    });
};


exports.delete = function (request, response) {
    let id = request.params.news_id;
    if (!ObjectId.isValid(id)) {
        response.status(400).send({
            message: 'Bad id.'
        });
        return;
    }
    News.deleteOne({
        _id: id
    }, (err, news) => {
        if (err)
            response.send(err);
        response.status(204).send({
            status: "success",
            message: 'Contact deleted'
        });
    });
};
