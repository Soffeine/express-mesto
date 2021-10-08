const express = require('express');
const  PORT = 3000;
const app = express();
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const mongoose = require('mongoose');
const bodyParser =  require('body-parser');

app.use((req, res, next) => {
  req.user = {
    _id: '615edfe2980c9c4c6d460e1a'
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log('it works!!!')
});