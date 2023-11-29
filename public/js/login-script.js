document.addEventListener("DOMContentLoaded", function () {
	// Smooth Scrolling for Links
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault()
			document.querySelector(this.getAttribute("href")).scrollIntoView({
				behavior: "smooth",
			})
		})
	})

	// Form Validation Feedback
	const inputs = document.querySelectorAll(".form-input")
	inputs.forEach((input) => {
		input.addEventListener("blur", function () {
			if (this.value.trim() === "") {
				this.classList.add("invalid")
			} else {
				this.classList.remove("invalid")
			}
		})
	})

	// Animation on Load
	document.body.classList.add("page-loaded")

	// Button Hover Effect
	const buttons = document.querySelectorAll(".btn-login")
	buttons.forEach((button) => {
		button.addEventListener("mouseover", () => {
			button.classList.add("hover")
		})
		button.addEventListener("mouseout", () => {
			button.classList.remove("hover")
		})
	})
})
