const QuestionAnswer = require("../models/QuestionAnswer")
const OpenAI = require("openai")
require("dotenv").config({ path: "./config/.env" })
// Initialize the OpenAI API with API key from .env
const openai = new OpenAI({
	organization: "org-C3ZnqEuOgKnuHWXSec2iNB22",
	apiKey: process.env.OPENAI_API_KEY,
})

module.exports = {
	getProfile: async (req, res) => {
		try {
			const userId = req.params.id
			const messages = await QuestionAnswer.find({ userId: userId })
			res.render("profile.ejs", {
				user: req.user,
				messages: messages,
			})
		} catch (err) {
			console.log(err)
		}
	},

	getQuestions: async (req, res) => {
		try {
			if (!req.user) {
				return
			}
			const questionAnswer = await QuestionAnswer.find({
				userId: req.user.id,
			})
				.select("questionAnswer text")
				.lean()

			console.log("QnA:", questionAnswer)

			res.render("questions.ejs", {
				user: req.user,
				questionAnswer: questionAnswer,
			})
		} catch (err) {
			console.log(err)
		}
	},

	generateQuestions: async (req, res) => {
		try {
			const { userText } = req.body // Access the text from the request body
			// Create a chat completion with OpenAI
			const completion = await openai.chat.completions.create({
				model: "gpt-4",
				messages: [
					{
						role: "system",
						content: "You are a helpful assistant.",
					},
					{
						role: "user",
						content: `Generate space repetition questions and answers based on the following text: ${userText} and this format and should be Question: Answer\n\n and dont include the word 'Question' or 'Answer' in the text and dont number them.`,
					},
				],
			})

			const generatedQuestions = completion.choices[0].message.content.trim()
			console.log("Generated questions:", generatedQuestions) // Log the generated questions

			// Save the generated questions to the MongoDB database
			const newQuestionAnswer = new QuestionAnswer({
				userId: req.user.id, // Assuming you have a user object in the request
				text: userText,
				questionAnswer: generatedQuestions.split("\n\n").map((qna) => {
					const [question, answer] = qna.split("\n")
					return { question: question.trim(), answer: answer.trim() }
				}),
			})
			await newQuestionAnswer.save()

			console.log("Saved question-answer:", newQuestionAnswer) // Log the saved question-answer

			// Render the EJS template with the generated questions and answers
			res.render("new-questions.ejs", {
				user: req.user,
				questionAnswer: newQuestionAnswer.questionAnswer,
				text: newQuestionAnswer.text,
			})
		} catch (err) {
			console.log("Error:", err) // Log any error that occurs
			res
				.status(500)
				.json({ error: "An error occurred while generating questions" })
		}

		console.log(JSON.stringify(QuestionAnswer, null, 2))
	},

	deleteQuestions: (req, res) => {},
}
