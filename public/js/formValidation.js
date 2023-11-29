document
	.getElementById("textForm")
	.addEventListener("submit", function (event) {
		var userText = document.getElementById("userText").value
		var loading = document.getElementById("loading")
		if (!userText.trim()) {
			event.preventDefault()
			alert("Please enter some text before submitting.")
		} else {
			loading.style.display = "block"
		}
	})

document.getElementById("textForm").addEventListener("submit", function (e) {
	let text = document.querySelector(".content-textarea").value
	let wordCount = text.split(/\s+/).length
	if (wordCount > 500) {
		e.preventDefault()
		alert("Your text should not exceed 500 words!")
	}
})

document.getElementById("textForm").addEventListener("submit", function () {
	document.getElementById("loading").style.display = "block"
	document.getElementById("submit").style.display = "none"
})
