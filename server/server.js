const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = require('express')();
const users = require('./app/route/user-routes');
const config = require('config');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(users);

const http = require('http').createServer(app);
const io = require('socket.io');

const endpoints = require('./app/constants/newsEndpoints');
const newsController = require('./app/controller/newsController');

const socket = io(http);
const port = config.get('port');

mongoose.connect(config.get('mongoUri'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const database = mongoose.connection;
database ? console.log("Db connected successfully") : console.log("Error connecting db");

socket.on('connection', (socket) => {
    console.log('User connected');
    socket.on(endpoints.getAll, (params) => {
        newsController.getAllNews(params, (data) => socket.emit(endpoints.sendAll, data));
    });
    socket.on(endpoints.updateNews, (news) => {
        console.log("update");
        newsController.update(news, (data) => socket.emit(endpoints.sendUpdatedNews, data));
    });
    socket.on(endpoints.createNews, (news) => {
        console.log('create');
        newsController.new(news, (data) => socket.emit(endpoints.sendNewNews, data));
    });
    socket.on(endpoints.deleteNews, (id) => {
        console.log('Delete');
        newsController.delete(id, (data) => socket.emit(endpoints.sendDeletedNews, data));
    });
    socket.on('disconnect', () => {
        console.log('Disconnected!');
    })
});

http.listen(port, (socketConnectOpts) => {
    console.log('Connected to port: ' + port)
});