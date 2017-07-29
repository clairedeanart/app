require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.resolve(__dirname, './public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './src/views'));

app.get('/', function(req, res, next) {
  res.render('pages/index');
});

const port = process.env.PORT || 4040;
app.listen(port, function() {
  console.log("Listening on", port);
});
