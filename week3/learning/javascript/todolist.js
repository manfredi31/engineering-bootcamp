
task_list = []
let quit = false
let task_id_counter = 0 // global counter for unique ids

function add_a_task() {
    const task_text = prompt("What's the task you want to add?");

    const new_task = {
        id: task_id_counter++,
        task: task_text,
        done: false,
        createdAt: new Date()
    };

    task_list.push(new_task)
    console.log(`Task added: "${task_text}"`);

}

function list_task() {
    if (task_list.length === 0) {
        console.log("Your todo list is empty.");
        return;
    }

    console.log("Your Tasks:");
    task_list.forEach((task, index) => {
        const status = task.done ? "[✓]" : "[ ]";
        console.log(`${index}. ${status} ${task.task} (Created at: ${task.createdAt.toLocaleString()})`);
    })
}

function delete_task() {
    list_task()
    const index_to_delete = Number(prompt("What is the index of the task you want to delete? "));

    if (index_to_delete >= 0 && index_to_delete < task_list.length) {
        const removed = task_list.splice(index_to_delete, 1);
        console.log(`Deleted task: "${removed[0].task}"`);
    } else {
        console.log(" Invalid index");
    }
}

function mark_done() {
    list_task()
    const index_done = Number(prompt("What is the index of the task you want to mark as done? "));

    if (task_list[index_done].done) {
        console.log(" This task is already marked as done.");
        return;
    }

    if (index_done >= 0 && index_done < task_list.length) {
        task_list[index_done].done = true
        console.log(`Task marked as done: "${task_list[index_done].task}"`);
    } else {
        console.log(" Invalid index");
    }
}

function quit_app() {
    quit = true
}

while (!quit) {
    console.log("Welcome to your todo list!");
    console.log(`The list below is what you can do: 
        1. add 
        2. list
        3. delete
        4. done
        5. quit `);
    let x = prompt("Please make your choice: ")
    if (x == "add") {
        add_a_task()
    } else if (x == "list") {
        list_task()
    } else if (x == "delete") {
        delete_task()
    } else if (x == "done") {
        mark_done()
    } else if (x == "quit") {
        quit_app()
    }
    
    }