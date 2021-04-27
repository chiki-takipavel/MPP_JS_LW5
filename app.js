const express = require('express')
const session = require('express-session')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.set('views', 'templates');
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(session({
	secret: 'keyboard cat',
	cookie: { maxAge: 60000000 },
	resave: true,
	saveUninitialized: true
}));

app.get("/", function(request, response){
	response.render('index', {});
});
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/plans', require('./routes/plans.routes'))

const PORT = config.get('port') || 5000

async function start()
{
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()
