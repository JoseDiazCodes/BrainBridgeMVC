const mongoose = require("mongoose")

const QuestionAnswerSchema = mongoose.Schema({
	userId: mongoose.Schema.Types.ObjectId, // To associate with a user
	text: String, // The original text
	questionAnswer: [
		{
			question: String,
			answer: String,
			isCorrect: { type: Boolean, default: null },
			cooldown: Date, // Add this line to include a cooldown field
		},
	], // Array of question-answer pairs
	// Whether the user got the question right
})

module.exports = mongoose.model("QuestionAnswer", QuestionAnswerSchema)
