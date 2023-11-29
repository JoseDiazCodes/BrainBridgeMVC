const QuestionAnswer = require("../models/QuestionAnswer")

function msToTime(duration) {
	let seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

	hours = (hours < 10 ? "0" : "") + hours
	minutes = (minutes < 10 ? "0" : "") + minutes
	seconds = (seconds < 10 ? "0" : "") + seconds

	return hours + ":" + minutes + ":" + seconds
}

module.exports = {
	getQuiz: async (req, res) => {
		try {
			const questionAnswers = await QuestionAnswer.find({ userId: req.user.id })
				.select("questionAnswer")
				.lean()

			// Create the quiz
			const quiz = questionAnswers.flatMap((qa) => {
				return qa.questionAnswer.map((item) => {
					const cooldown = item.cooldown || "1970-01-01T00:00:00Z" // Default to 0 if item.cooldown is null
					const cooldownTimestamp = Date.parse(cooldown) // Convert cooldown to a timestamp
					const remainingCooldown = msToTime(
						Math.max(0, cooldownTimestamp - Date.now())
					)
					const remainingCooldownNumber = Number(
						remainingCooldown.replace(/:/g, "")
					)

					// If the timer has reached 0, set isCorrect to null
					let isCorrect = item.isCorrect
					if (remainingCooldown === "00:00:00") {
						isCorrect = null
					}

					return {
						_id: item._id,
						question: item.question,
						answer: item.answer,
						isCorrect: isCorrect,
						cooldown: item.cooldown,
						remainingCooldown: remainingCooldown,
						remainingCooldownNumber: remainingCooldownNumber,
					}
				})
			})
			quiz.sort((a, b) => {
				return a.remainingCooldownNumber - b.remainingCooldownNumber
			})

			console.log("quiz:", quiz) // Log the quiz array to the console
			// Filter out questions thats are still in their cooldown period
			const availableQuiz = quiz.filter((item) => Date.now() > item.cooldown)
			// Count the number of correct questions and total questions
			let correctCount = 0
			let totalCount = availableQuiz.length

			availableQuiz.forEach((item) => {
				if (item.isCorrect) {
					correctCount++
				}
			})

			res.render("quiz.ejs", {
				user: req.user,
				questionAnswer: questionAnswers,
				quiz: quiz,
				correctCount: correctCount,
				totalCount: totalCount,
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

			// Get the current isCorrect value and correctStreak
			const isCorrect = questionAnswer.questionAnswer[0].isCorrect
			const correctStreak = questionAnswer.questionAnswer[0].correctStreak || 0

			// If the question was answered correctly, increase the cooldown period and the correctStreak
			let newCooldown = questionAnswer.questionAnswer[0].cooldown
			if (isCorrect) {
				newCooldown = Date.now() + 24 * 60 * 60 * 1000 * (correctStreak + 1)
			}

			// Update the isCorrect field, the correctStreak, and the cooldown
			const result = await QuestionAnswer.updateOne(
				{ _id: questionAnswerId, "questionAnswer._id": questionId },
				{
					$set: {
						"questionAnswer.$.isCorrect": true, // Set isCorrect to true
						"questionAnswer.$.correctStreak": isCorrect ? correctStreak + 1 : 0,
						"questionAnswer.$.cooldown": newCooldown,
					},
				}
			)

			// Fetch the updated questionAnswer
			const updatedQuestionAnswer = await QuestionAnswer.findOne(
				{ _id: questionAnswerId, "questionAnswer._id": questionId },
				{ "questionAnswer.$": 1 }
			)

			// Get the updated isCorrect value and correctStreak
			const updatedIsCorrect = updatedQuestionAnswer.questionAnswer[0].isCorrect
			const updatedCorrectStreak =
				updatedQuestionAnswer.questionAnswer[0].correctStreak || 0

			// If the question was answered correctly, increase the cooldown period and the correctStreak
			let updatedCooldown = updatedQuestionAnswer.questionAnswer[0].cooldown
			if (updatedIsCorrect) {
				updatedCooldown =
					Date.now() + 24 * 60 * 60 * 1000 * (updatedCorrectStreak + 1)
			}

			// Update the isCorrect field, the correctStreak, and the cooldown again
			const updatedResult = await QuestionAnswer.updateOne(
				{ _id: questionAnswerId, "questionAnswer._id": questionId },
				{
					$set: {
						"questionAnswer.$.isCorrect": true, // Set isCorrect to true
						"questionAnswer.$.correctStreak": updatedIsCorrect
							? updatedCorrectStreak + 1
							: 0,
						"questionAnswer.$.cooldown": updatedCooldown,
					},
				}
			)

			res.redirect("/quiz/quiz") // Redirect to the quiz page
		} catch (err) {
			console.log(err)
			res.status(500).send("Error marking question as correct")
		}
	},

	markQuestionAsIncorrect: async (req, res) => {
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

			// If the question was answered incorrectly, set the cooldown period to 5 minutes and reset the correctStreak
			let newCooldown = questionAnswer.questionAnswer[0].cooldown
			if (!isCorrect) {
				newCooldown = Date.now() + 5 * 60 * 1000 // 5 minutes in milliseconds
			}

			// Update the isCorrect field, the correctStreak, and the cooldown
			const result = await QuestionAnswer.updateOne(
				{ _id: questionAnswerId, "questionAnswer._id": questionId },
				{
					$set: {
						"questionAnswer.$.isCorrect": false, // Set isCorrect to false
						"questionAnswer.$.correctStreak": 0, // Reset the correctStreak
						"questionAnswer.$.cooldown": newCooldown,
					},
				}
			)

			// Fetch the updated questionAnswer
			const updatedQuestionAnswer = await QuestionAnswer.findOne(
				{ _id: questionAnswerId, "questionAnswer._id": questionId },
				{ "questionAnswer.$": 1 }
			)

			// Log the updated questionAnswer
			console.log(updatedQuestionAnswer)

			res.redirect("/quiz/quiz") // Redirect to the quiz page
		} catch (err) {
			console.log(err)
			res.status(500).send("Error marking question as incorrect")
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
