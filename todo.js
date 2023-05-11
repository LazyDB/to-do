import { Subject } from "./subject.js";

const qs = (q) => document.querySelector(q);

const TODO_LIST_SELECTOR = "#todo-list";

const OBSERVER_SIGNATURE = ["renderList", "handleEdit", ];

const TODO_FORM_SELECTOR = ".todo-form";

const TODO_INPUT_SELECTOR = ".new-list";

const TODO_TITLE_SELECTOR = ".todo-title";

const overallStatus = document.querySelector(".Overall-status");

const TODO_STATUS = {
    1: "In Progress",
    2: "Done",
    3: "Cancelled",
};

export class Todo extends Subject {
    constructor() {
        super();
        this.todos = [];
        OBSERVER_SIGNATURE.forEach((observer) => {
            this.register(this[observer].bind(this));
        });
    }

    handleSubmit() {
        const todoInput = qs(TODO_INPUT_SELECTOR);
        //checks if only whitespaces
        if (!todoInput.value || todoInput.value.match(/^\s*$/)) {
            alert("Please provide an input task");
        }
        else {
            const value = todoInput.value;
            if (!value) {
                return;
            }
            const newTodo = {
                id: this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 0,
                title: value,
                status: 1,
            };
            this.todos.push(newTodo);
            this.notifyObserver(this.todos);
        }
        todoInput.value = "";
    }

    handleEdit(event) {
        const todoRow = event.target.closest("tr");
        if (!todoRow) {
            return;
        }
        const todoTitle = todoRow.querySelector(TODO_TITLE_SELECTOR);
        todoTitle.setAttribute("contenteditable", true);
        todoTitle.focus();
        todoTitle.classList.add("editable");

        this.notifyObserver({ type: "edit", todoId: todoRow.dataset.todoId });
    }

    handleDelete(event) {
        const todoRow = event.target.closest("tr");
        if (!todoRow) {
            return;
        }
        const todoId = parseInt(todoRow.dataset.todoId);
        const index = this.todos.findIndex((todo) => todo.id === todoId);
        if (index !== -1) {
            this.todos.splice(index, 1);
            this.notifyObserver(this.todos);
        }
        todoRow.remove();
    }


    renderList(todos) {
        const listContainer = qs(TODO_LIST_SELECTOR);
        if (!listContainer) {
            return;
        }
        if (!todos || !todos.length) {
            return;
        }
        let htmlContent = "";
        for (let i = 1; i < todos.length; i++) {
            htmlContent += `<tr data-todo-id="${todos[i].id}">
                  <td><input type="checkbox">${todos[i].id}</td>
                  <td class="todo-title">${todos[i].title}</td>
                  <td>${TODO_STATUS[todos[i].status]}</td>
                  <td class="action-btn">
                      <button class="edit-btn" style="border:none; background-color: white; cursor: pointer;"><i class="fa-solid fa-pencil fa-xl" style="color: #114db6;"></i></button>
                      <button class="delete-btn" style="border:none; background-color: white; cursor: pointer;" data-todo-id="${todos[i].id
                }"><i class="fa-regular fa-trash-can fa-xl" style="color: #114db6;"></i></button>
                  </td>
              </tr>`;
        }

        listContainer.innerHTML = htmlContent;


        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach((button) => {
            button.addEventListener("click", this.handleEdit.bind(this));
        });

        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", this.handleDelete.bind(this));
        });

        const masterCheckbox = document.getElementById('select-all');
        const tableCheckboxes = document.querySelectorAll('table input[type="checkbox"]');
        masterCheckbox.addEventListener('change', () => {
            tableCheckboxes.forEach((checkbox) => {
                checkbox.checked = masterCheckbox.checked;
            });
        })


/*         // for dropdown
        const done = document.getElementById('dropdown-done');
        const dataTable = document.getElementById('tabule');
        // Add an event listener to the filter dropdown to filter the table rows
        done.addEventListener('change', () => {
            // Get the selected filter value
            const filterValue = done.value;

            // Get all the table rows
            const rows = dataTable.getElementsByTagName('tr');

            // Loop through each row and hide/show based on the selected filter value
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const status = row.getElementsByTagName('td')[2].textContent;

                if (filterValue === 'In Progress' || status.toLowerCase() === 'in progress') {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
        function updateOverallStatus() {
            const doneCount = document.querySelectorAll(
                '#todo-list input[type="checkbox"][data-status="Done"]'
            ).length;
            const inProgressCount = document.querySelectorAll(
                '#todo-list input[type="checkbox"][data-status="In Progress"]'
            ).length;
            const cancelledCount = document.querySelectorAll(
                '#todo-list input[type="checkbox"][data-status="Cancelled"]'
            ).length;

            // update the number of items in each status category in the Overall Status section
            overallStatus.querySelector(
                ".done-status"
            ).textContent = `(${doneCount})`;
            overallStatus.querySelector(
                ".demo"
            ).textContent = `(${inProgressCount})`;
            overallStatus.querySelector(
                ".cancelled-status"
            ).textContent = `(${cancelledCount})`;
        } */

        const todoTitles = document.querySelectorAll(".todo-title");
        todoTitles.forEach((title) => {
            title.addEventListener("blur", () => {
                title.setAttribute("contenteditable", false);
                title.classList.remove("editable");
            });
        });

    } 



    initApp() {    
        // this.renderOverallStatus(this.todos);
        const todoForm = qs(TODO_FORM_SELECTOR);
        // checks whether todo form exists in the dom
        if (todoForm) {
          console.log("TODO form exists in DOM");
          todoForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearAsync();
            this.handleSubmit();
          });
        }
      }
}

async function clearAsync(){
    const todoInput = qs(TODO_INPUT_SELECTOR);
    
        await new Promise(resolve => setTimeout(resolve, 10));
        todoInput.value = "";
    
}
