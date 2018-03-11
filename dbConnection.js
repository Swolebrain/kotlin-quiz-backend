const mongoose = require('mongoose');

// const options = {
//   useMongoClient: true,
//   autoIndex: true, // Don't build indexes
//   reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//   reconnectInterval: 500, // Reconnect every 500ms
//   poolSize: 10, // Maintain up to 10 socket connections
// };

const conn = mongoose.createConnection('mongodb://localhost:27017/kotlin-quiz');

const QuestionSchema = mongoose.Schema({
  question: String,
  answerChoices: [{ answer: String, correct: Boolean }],
  questionType: String,
  adaptive: Boolean,
  createdDate: Number
});

const Question = conn.model('Question', QuestionSchema);

module.exports = Question;