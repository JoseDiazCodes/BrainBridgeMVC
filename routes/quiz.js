const express = require("express")
const router = express.Router()
const quizController = require("../controllers/quiz")

router.get("/quiz/", quizController.getQuiz)
router.post("/quiz", quizController.addQuestion)
router.put(
	"/markQuestionAsIncorrect/:questionAnswerId/:questionId/",
	quizController.markQuestionAsIncorrect
)
router.put(
	"/markQuestionAsCorrect/:questionAnswerId/:questionId/",
	quizController.markQuestionAsCorrect
)
router.delete(
	"/deleteQuestion/:questionAnswerId/:questionId/",
	quizController.deleteQuestion
)
module.exports = router
