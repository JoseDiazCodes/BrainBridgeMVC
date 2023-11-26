document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("textForm").addEventListener("submit", function (e) {
		e.preventDefault()

		const textarea = document.querySelector(".content-textarea")
		const userText = textarea.value

		fetch("/messages", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userText: userText }),
		})
			.then((response) => {
				if (response.ok) return response.json()
				else throw new Error("Server error")
			})
			.then((data) => {
				displayQuestions(data.questions)
				textarea.value = ""
			})
			.catch((error) => {
				console.error("Error:", error)
			})
	})
})

function displayQuestions(questions) {
	const questionsContainer = document.getElementById("questionsContainer")
	questionsContainer.innerHTML = "" // Clear previous questions
	questions.forEach((question) => {
		const questionElem = document.createElement("p")
		questionElem.textContent = question
		questionsContainer.appendChild(questionElem)
	})
}
