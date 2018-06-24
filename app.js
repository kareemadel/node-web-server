const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');
const fsPromises = fs.promises;

const app = express();
hbs.registerPartials(path.join(__dirname, path.join('views', 'partials')));

app.set('view engine', 'hbs');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (message) => {
    return message.toUpperCase();
});

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} - ${req.url}`;
    let fileHandle = fsPromises.open('server.log', 'a');
    fileHandle
        .then((fileHandle) => {
            return fileHandle.appendFile(log + '\n', {
                encoding: 'utf-8',
            });
        })
        .then((result) => {
            console.log('Log written successfully.');
            next();
        })
        .catch((errMessage) => {
            res.render('maintenance', {
                welcomeMessage: 'the website is under maintenance.',
            });
            console.log(errMessage);
        });
});

app.get('/', (req, res) => {
    res.render('home', {
        pageHeader: 'Home',
        welcomeMessage: 'Welcome to Some Website',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        pageHeader: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errMessage: 'Unable to handle the request',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        pageHeader: 'Help Page',
    });
});

app.get('/maintenance', (req, res) => {
    app.render('maintenance', {
        welcomeMessage: 'Wecolme to Some Website',
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`The server is listening on port: ${port}`);
});
