# Week 1 reflection

Answer each question in 1–3 sentences, in your own words.

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?
   Imperative UI development involves manually changing DOM elements using JavaScript, while declarative UI development describes how the interface should look based on the current data and state. React makes UI development easier by automatically updating the interface when the data changes.

2. Why must a component name start with a capital letter?
   React uses capitalized names to distinguish custom React components from built-in HTML elements. For example, Header is treated as a React component, while header is treated as an HTML element.

3. What does a fragment <>...</> do, and why not just use a <div>?
   A React fragment allows multiple elements to be returned together without adding an extra DOM element. It helps keep the HTML structure cleaner when an additional <div> is unnecessary.

4. Name one benefit of splitting the UI into small components.
   Splitting the UI into small components makes the code easier to understand, maintain, and reuse. For example, the Header and Footer can be managed separately from the menu items in CampusEats.
