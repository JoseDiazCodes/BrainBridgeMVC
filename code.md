```js

									<!-- <% for(var i=0; i<questions.length; i++) {%>
										<li class="message">
										  <span><%= questions[i].msg %></span>
										</li>
									  <% } %>  -->
```

taken out of the questions ejs

```js

	<% questionAnswer.qna.forEach(function(qna) { %>
									<li><strong>Question:</strong> <%= qna.question %></li>
									<li><strong>Answer:</strong> <%= qna.answer %></li>
									<% }); %>

```

```js
									<% qna.forEach(function(qna) { %>
									<li><strong>Question:</strong> <%= qna.question %></li>
									<li><strong>Answer:</strong> <%= qna.answer %></li>
									<% }); %>
```

```js
									<% qna.forEach(el => { %>
									<li>
										<div class="question">
											<div class="question__text"><%= el.question %></div>
											<div class="question__answer"><%= el.answer %></div>
										</div>
									</li>
									<% }) %>
```

```html
<% for (let qa of questionAnswer) { %> <% for (let key in qa) { %> <% if (key
!== '_id' && key !== 'userId' && key !== '__v') { %> <% if
(Array.isArray(qa[key])) { %> <% for (let obj of qa[key]) { %> <% for (let
innerKey in obj) { %> <% if (innerKey !== '_id' && innerKey !== 'userId' &&
innerKey !== '__v') { %>
<li>
	<strong><%= innerKey.charAt(0).toUpperCase() + innerKey.slice(1) %> :</strong>
	<%= obj[innerKey] %>
</li>
<% } %> <% } %> <% } %> <% } else { %>
<li>
	<strong><%= key.charAt(0).toUpperCase() + key.slice(1) %> :</strong>
	<%= qa[key] %>
</li>
<% } %> <% } %> <% } %> <% } %>
```
