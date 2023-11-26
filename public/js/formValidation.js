document.getElementById("textForm").addEventListener("submit", function (e) {
	var text = document.querySelector(".content-textarea").value
	var wordCount = text.split(/\s+/).length
	if (wordCount > 500) {
		e.preventDefault()
		alert("Your text should not exceed 500 words!")
	}
})
