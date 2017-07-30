require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const request = require('superagent');
const port = process.env.PORT || 4000;

console.log(port)
Promise = require('bluebird');

app.use(express.static(path.resolve(__dirname, './public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './src/views'));

app.use(function(req, res, next) {
  res.metadata = {
    API_URL: process.env.API_URL,
  };
  next();
});

app.get('/', function(req, res, next) {
  request.get(`${res.metadata.API_URL}/images`)
  .then((response => {
    var images = response.body;
    res.render('pages/index',
      Object.assign(res.metadata, {
        images,
        page: 'home',
      })
    );
  }))
});

app.get('/about', function(req, res, next) {
  res.render('pages/index',
    Object.assign(res.metadata, {
      page: 'about',
    })
  );
});

app.get('/contact', function(req, res, next) {
  res.render('pages/index',
    Object.assign(res.metadata, {
      page: 'contact',
    })
  );
});

app.listen(port, function() {
  console.log("Listening on", port);
});
