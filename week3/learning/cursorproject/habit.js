// 1. Find the form element on the page
const form = document.querySelector('form');
// This finds the first <form> element in your HTML and stores it in a variable called 'form'.

// 2. Find the input box where the user types the habit
const input = document.getElementById('habit-input');
// This finds the element with id="habit-input" and stores it in a variable called 'input'.

// 3. Find the <ul> where the habits will be listed
const habitList = document.querySelector('ul');
// This finds the first <ul> element in your HTML and stores it in a variable called 'habitList'.

// 4. Listen for the form's submit event
form.addEventListener('submit', function(event) {
  // This sets up a function to run whenever the form is submitted (when the user clicks the button).

  event.preventDefault();
  // This stops the page from reloading when the form is submitted (which is the default behavior).

  const habit = input.value.trim();
  // This gets the text the user typed into the input box, and removes any extra spaces from the start/end.

  if (habit !== '') {
    // This checks if the input is not empty.

    const li = document.createElement('li');
    // This creates a new <li> element (a list item).

    li.textContent = habit;
    // This sets the text of the <li> to the habit the user typed.

    habitList.appendChild(li);
    // This adds the new <li> to the end of the <ul> (the habit list).

    input.value = '';
    // This clears the input box so the user can type a new habit.
  }
});