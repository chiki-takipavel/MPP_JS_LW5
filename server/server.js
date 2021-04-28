const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const db = require('./app/config/db');
const fs = require('fs');
const path = require('path');
const News = require('./app/model/newsModel');
const auth = require('./auth');
const config = require('config');

const port = config.get('port');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(config.get('mongoUri'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const database = mongoose.connection;
database ? console.log("Db connected successfully") : console.log("Error connecting db");

const privateApiRoutes = require('./app/route/private-api-routes');
const publicApiRoutes = require('./app/route/public-api-routes');
app.use('/', publicApiRoutes);
app.use(auth.isAuthorized);
app.use('/', privateApiRoutes);
app.use(express.static(path.resolve(__dirname, "..", "build")))
app.listen(port, () => {
    console.log(`Running project on port ${port}`);
});