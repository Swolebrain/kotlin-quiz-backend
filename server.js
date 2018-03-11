const express = require('express');
const app = express();
const bp = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const fs = require('fs');
mongoose.Promise = global.Promise;

const Question = require('./dbConnection.js');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Method', 'OPTIONS,POST,GET,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization');
  return next();
});

app.use(express.static('static'));

app.use(bp.json());

const jwtValidator = jwt({
  secret: fs.readFileSync('./.cert.pem'),
  issuer: require('./.client.js'),
  audience: '1iR1RS9dUJmtxfmELJAIHeVkyNVnyz8A',
  algorithms: ['RS256', 'RS512']
});

app.get('/', (req, res) => {
  console.log("GET /");
  res.send("Home route ---");
});

app.get('/questions', jwtValidator, function(req, res){
  console.log("GET /questions");
  if (!req.user.email.endsWith('@triplebyte.com') && req.user.email.toLowerCase() !== 'fermartel@gmail.com') return res.status(401).json([{question: 'Unauthorized', _id: 1}]);
  Question.find({})
    .sort({createdDate: -1})
    .then(qs=>res.json(qs))
    .catch(ress=>console.log(err));
});

app.post('/questions', jwtValidator,  function(req, res){
  const q = new Question(req.body);
  q.createdDate = new Date().getTime();
  q.save()
    .then(dbRes => res.json(dbRes))
    .catch(ress=>console.log(err));
});

app.listen(1338, console.log('App listening....'));