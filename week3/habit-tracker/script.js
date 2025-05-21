// Define the Habit class
class Habit {
    constructor(text, tag) {
        this.id = uuidv4(); // Generate unique ID
        this.text = text;
        this.tag = tag;
        this.completed = false;
        this.createdAt = new Date();
    }
    
    toggle() {
        this.completed = !this.completed;
        return this;
    }
    
    edit(newText) {
        this.text = newText;
        return this;
    }
    
    // Helper method to categorize the habit
    isLifeHabit() {
        return this.tag === 'life';
    }
    
    isWorkHabit() {
        return this.tag === 'work';
    }
    
    // Convert to plain object for storage
    toJSON() {
        return {
            id: this.id,
            text: this.text,
            tag: this.tag,
            completed: this.completed,
            createdAt: this.createdAt
        };
    }
    
    // Create a habit instance from stored JSON data
    static fromJSON(data) {
        const habit = new Habit(data.text, data.tag);
        habit.id = data.id;
        habit.completed = data.completed;
        habit.createdAt = new Date(data.createdAt);
        return habit;
    }
}

// Initialize an empty array to store our habits
let habits = [];

// DOM Elements
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const lifeHabitsList = document.getElementById('life-habits-list');
const workHabitsList = document.getElementById('work-habits-list');
const lifeEmptyState = document.getElementById('life-empty-state');
const workEmptyState = document.getElementById('work-empty-state');
const darkmodeBtn = document.getElementById('dark-mode-btn');

// Functions
function init() {
    // Load habits from localStorage
    loadHabits();
    
    // Add event listeners
    habitForm.addEventListener('submit', addHabit);
    darkmodeBtn.addEventListener('click', () => {document.body.classList.toggle("body-dark-mode")});
    
    // Show empty states initially
    updateEmptyStates();
}

function addHabit(event) {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();
    
    // Get the habit text from the input
    const habitText = habitInput.value.trim();
    
    // Validate input (don't allow empty habits)
    if (habitText === '') {
        alert('Please enter a habit!');
        return;
    }
    
    // Get selected tag
    const selectedTag = document.querySelector('input[name="habit-tag"]:checked').value;
    
    // Create a new habit object using our Habit class
    const newHabit = new Habit(habitText, selectedTag);
    
    // Add the new habit to our array
    habits.push(newHabit);
    
    // Clear the input field
    habitInput.value = '';
    
    // Update the UI
    renderHabits();
    updateEmptyStates();
    
    // Save to localStorage
    saveHabits();
}

function renderHabits() {
    // Clear the current lists
    lifeHabitsList.innerHTML = '';
    workHabitsList.innerHTML = '';
    
    // Loop through each habit and create a DOM element for it
    habits.forEach(habit => {
        // Determine which list this habit belongs to
        const listContainer = habit.isLifeHabit() ? lifeHabitsList : workHabitsList;
        const habitTagClass = habit.isLifeHabit() ? 'life-habit' : 'work-habit';
        
        // Create the habit item container
        const habitItem = document.createElement('div');
        habitItem.classList.add('habit-item', habitTagClass);
        habitItem.dataset.id = habit.id;
        
        // Create the habit info (checkbox and text)
        const habitInfo = document.createElement('div');
        habitInfo.classList.add('habit-info');
        
        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('habit-checkbox');
        checkbox.checked = habit.completed;
        checkbox.addEventListener('change', () => toggleHabit(habit.id));
        
        // Create the habit text
        const habitText = document.createElement('span');
        habitText.textContent = habit.text;
        if (habit.completed) {
            habitText.classList.add('completed');
        }
        
        // Create the habit actions
        const habitActions = document.createElement('div');
        habitActions.classList.add('habit-actions');
        
        // Create the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteHabit(habit.id));
        
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn')
        editBtn.textContent = 'Edit'
        editBtn.addEventListener('click', () => editHabit(habit.id));

        // Assemble the habit item
        habitInfo.appendChild(checkbox);
        habitInfo.appendChild(habitText);
        habitActions.appendChild(deleteBtn);
        habitActions.appendChild(editBtn)
        habitItem.appendChild(habitInfo);
        habitItem.appendChild(habitActions);
        
        // Add the habit item to the appropriate list
        listContainer.appendChild(habitItem);
    });
}

function toggleHabit(id) {
    // Find the habit in our array and toggle its completed status using our class method
    habits = habits.map(habit => {
        if (habit.id === id) {
            return habit.toggle();
        }
        return habit;
    });
    
    // Update the UI
    renderHabits();
    
    // Save to localStorage
    saveHabits();
}

function deleteHabit(id) {
    // Remove the habit from our array
    habits = habits.filter(habit => habit.id !== id);
    
    // Update the UI
    renderHabits();
    updateEmptyStates();
    
    // Save to localStorage
    saveHabits();
}

function editHabit(id) {
    const habitText = document.querySelector(`[data-id="${id}"] .habit-info span`)
    habitText.contentEditable = true;
    habitText.focus();
    habitText.addEventListener('blur', () => saveEdit(id, habitText))
    habitText.addEventListener('keydown', function(event) { 
        if(event.key == 'Enter') {
            event.preventDefault(); // Prevent adding a new line
            saveEdit(id, habitText);
        }
    })
}

function saveEdit(id, habitText) {
    const newText = habitText.textContent;
    
    // Find and edit the habit using our class method
    habits = habits.map(habit => {
        if (habit.id === id) {
            return habit.edit(newText);
        }
        return habit;
    });
    
    habitText.contentEditable = false;
    
    // Save to localStorage
    saveHabits();
}

function updateEmptyStates() {
    // Filter habits by tag
    const lifeHabits = habits.filter(habit => habit.isLifeHabit());
    const workHabits = habits.filter(habit => habit.isWorkHabit());
    
    // Update Life habits empty state
    if (lifeHabits.length === 0) {
        lifeEmptyState.classList.remove('hidden');
    } else {
        lifeEmptyState.classList.add('hidden');
    }
    
    // Update Work habits empty state
    if (workHabits.length === 0) {
        workEmptyState.classList.remove('hidden');
    } else {
        workEmptyState.classList.add('hidden');
    }
}

// Save habits to localStorage
function saveHabits() {
    // Convert Habit instances to plain objects before stringifying
    const habitsToSave = habits.map(habit => habit.toJSON());
    localStorage.setItem('habits', JSON.stringify(habitsToSave));
}

// Load habits from localStorage
function loadHabits() {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
        try {
            // Parse the stored JSON string 
            const parsedHabits = JSON.parse(storedHabits);
            
            // Convert plain objects back to Habit instances
            habits = parsedHabits.map(habitData => Habit.fromJSON(habitData));
            
            // Update the UI
            renderHabits();
            updateEmptyStates();
        } catch (error) {
            console.error('Error loading habits from localStorage:', error);
            // If there's an error, start with empty habits
            habits = [];
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 