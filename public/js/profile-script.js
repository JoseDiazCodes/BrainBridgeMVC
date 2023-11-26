const menuItems = document.querySelectorAll(".sidebar-menu__link")

const navItems = document.querySelectorAll(".nav-item")

menuItems.forEach((menuItem) => {
	menuItem.addEventListener("click", (e) => {
		if (!e.target.classList.contains("active")) {
			document
				.querySelector(".sidebar-menu__link.active")
				.classList.remove("active")
			e.target.classList.add("active")
		}
	})
})

navItems.forEach((navItem) => {
	navItem.addEventListener("click", (e) => {
		if (!e.target.classList.contains("active")) {
			document.querySelector(".nav-item.active").classList.remove("active")
			e.target.classList.add("active")
		}
	})
})

const cards = document.querySelectorAll(".card")
const mainContent = document.querySelector(".main-content")

cards.forEach((card) => {
	card.addEventListener("click", () => {
		console.log("")
		document.startViewTransition(() => {
			if (!card.classList.contains("active")) {
				mainContent.classList.add("expanded")
				card.classList.add("active")
			} else {
				card.classList.remove("active")
				mainContent.classList.remove("expanded")
			}
		})
	})
})

document
	.querySelector('.toggle input[type="checkbox"]')
	.addEventListener("change", function () {
		if (this.checked) {
			document.body.classList.add("light-mode")
		} else {
			document.body.classList.remove("light-mode")
		}
	})

document
	.querySelector('.toggle input[type="checkbox"]')
	.addEventListener("change", function () {
		if (this.checked) {
			document.body.classList.add("light-mode")
			localStorage.setItem("themeMode", "light") // Save mode to Local Storage
		} else {
			document.body.classList.remove("light-mode")
			localStorage.setItem("themeMode", "dark") // Save mode to Local Storage
		}
	})

document.addEventListener("DOMContentLoaded", (event) => {
	const savedThemeMode = localStorage.getItem("themeMode")
	if (savedThemeMode === "light") {
		document.body.classList.add("light-mode")
		document.querySelector('.toggle input[type="checkbox"]').checked = true
	}
})

function showAnswer(questionElement) {
	// Find the answer element
	var answerElement = questionElement.nextElementSibling

	// Toggle the display of the answer element
	if (answerElement.style.display === "none") {
		answerElement.style.display = "block"
	} else {
		answerElement.style.display = "none"
	}
}
