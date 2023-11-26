// Existing code
const express = require("express")
const router = express.Router()
const quizController = require("../controllers/quiz")

// Updated routes
router.get("/quiz/", quizController.getQuiz)
router.post("/quiz", quizController.addQuestion)
router.put(
	"/markQuestionAsCorrect/:questionAnswerId/:questionId/",
	quizController.markQuestionAsCorrect
)
router.delete(
	"/deleteQuestion/:questionAnswerId/:questionId/",
	quizController.deleteQuestion
)
module.exports = router
