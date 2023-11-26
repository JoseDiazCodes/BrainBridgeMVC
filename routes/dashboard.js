// Existing code
const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboard")
const { ensureAuth } = require("../middleware/auth")

// Updated routes
router.get("/profile/:id", ensureAuth, dashboardController.getProfile)
router.get("/questions/", dashboardController.getQuestions)
router.post("/generateQuestions/:id", dashboardController.generateQuestions)
router.delete("/deleteQuestions/:id", dashboardController.deleteQuestions)

module.exports = router
