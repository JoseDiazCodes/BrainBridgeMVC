const QuestionAnswer = require("../models/QuestionAnswer")

module.exports = {
	getQuiz: async (req, res) => {
		try {
			const questionAnswers = await QuestionAnswer.find({ userId: req.user.id })
				.select("questionAnswer")
				.lean()

			// Create the quiz
			const quiz = questionAnswers.flatMap((qa) => {
				return qa.questionAnswer.map((item) => {
					return {
						_id: item._id,
						question: item.question,
						answer: item.answer,
						isCorrect: item.isCorrect, // Add this line to include the isCorrect field
					}
				})
			})

			// Count the number of correct questions and total questions
			let correctCount = 0
			let totalCount = quiz.length

			quiz.forEach((item) => {
				if (item.isCorrect) {
					correctCount++
				}
			})

			// ...

			res.render("quiz.ejs", {
				user: req.user,
				questionAnswer: questionAnswers,
				quiz: quiz,
				correctCount: correctCount, // Pass the correctCount to the template
				totalCount: totalCount, // Pass the totalCount to the template
			})
		} catch (err) {
			console.log(err)
			res.status(500).send("Error rendering quiz")
		}
	},

	addQuestion: async (req, res) => {
		try {
			const { userId, question, answer } = req.body
			const newQuestionAnswer = new QuestionAnswer({
				userId,
				questionAnswer: { question, answer },
			})
			await newQuestionAnswer.save()
			res.status(201).send("Question added")
		} catch (err) {
			console.log(err)
			res.status(500).send("Error adding question")
		}
	},

	markQuestionAsCorrect: async (req, res) => {
		try {
			const questionAnswerId = req.params.questionAnswerId
			const questionId = req.params.questionId

			// Fetch the current questionAnswer
			const questionAnswer = await QuestionAnswer.findOne(
				{ _id: questionAnswerId, "questionAnswer._id": questionId },
				{ "questionAnswer.$": 1 }
			)

			// Get the current isCorrect value
			const isCorrect = questionAnswer.questionAnswer[0].isCorrect

			// Update the isCorrect field to the opposite value
			const result = await QuestionAnswer.updateOne(
				{ _id: questionAnswerId, "questionAnswer._id": questionId },
				{ $set: { "questionAnswer.$.isCorrect": !isCorrect } }
			)

			res.redirect("/quiz/quiz") // Redirect to the quiz page
		} catch (err) {
			console.log(err)
			res.status(500).send("Error marking question as correct")
		}
	},

	deleteQuestion: async (req, res) => {
		try {
			const questionAnswerId = req.params.questionAnswerId
			const questionId = req.params.questionId

			console.log(
				`questionAnswerId: ${questionAnswerId}, questionId: ${questionId}`
			) // Log the IDs

			const result = await QuestionAnswer.updateOne(
				{ _id: questionAnswerId },
				{ $pull: { questionAnswer: { _id: questionId } } }
			)

			console.log(result) // Log the result of the delete operation

			res.redirect("/quiz/quiz")
		} catch (err) {
			console.log(err)
			res.status(500).send("Error deleting question")
		}
	},
}
