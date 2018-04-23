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
  res.header('Access-Control-Allow-Method', 'OPTIONS,POST,GET,PUT,PATCH');
  res.header('Access-Control-Allow-Methods', 'OPTIONS,POST,GET,PUT,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization');
  return next();
});


app.use(bp.json());

const jwtValidator = jwt({
  secret: fs.readFileSync('./.cert.pem'),
  issuer: require('./.client.js'),
  audience: '1iR1RS9dUJmtxfmELJAIHeVkyNVnyz8A',
  algorithms: ['RS256', 'RS512']
});


app.get('/kotlin/questions', function(req, res){
  console.log("GET /questions");
  Question.find({})
    // .sort({createdDate: -1})
    .then(qs=>res.json(qs))
    .catch(err=>res.status(500).json(err));
});

app.post('/kotlin/questions', jwtValidator,  emailValidator, function(req, res){
  console.log('POST /questions');

  const q = new Question(req.body);
  q.createdBy = req.user.email;
  q.createdDate = new Date().getTime();
  q.save()
    .then(dbRes => res.json(dbRes))
    .catch(err=>res.status(500).json(err));
});

app.put('/kotlin/questions/:id', jwtValidator, emailValidator, async (req, res) => {
  const {id:qid} = req.params;
  console.log(`PUT /questions/${qid}`);
  try{
    const existingQuestion = await Question.findOne({_id: qid});
    if (!existingQuestion) return res.status(400).json({err: 'couldn\'t find that id'});

    for (let key in req.body) existingQuestion[key] = req.body[key];

    const saveResult = await existingQuestion.save();
    if (!saveResult) throw 'Error while saving to db';
    res.json({saveResult});
  }
  catch(err){
    console.log(err);
    res.status(500).json({err});
  }
});

function emailValidator(req, res, next){
    if (!req.user.email.endsWith('@triplebyte.com') &&
        !req.user.email.endsWith('@toptal.com') &&
        req.user.email.toLowerCase() !== 'fermartel@gmail.com' &&
        req.user.email.toLowerCase() !== 'imoreno138@gmail.com')
        return res.status(401).json([{question: 'Unauthorized', _id: 1}]);
    next();
}

app.listen(1338, console.log('App listening....'));