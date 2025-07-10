const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

const API_URL = 'http://localhost:3000/todos'; // バックエンドのURL

// Todoアイテムを取得して表示する関数
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Todoリストをレンダリングする関数
function renderTodos(todos) {
    todoList.innerHTML = ''; // 一度クリア
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        if (todo.completed) {
            li.classList.add('completed');
        }

        // 完了状態を切り替えるイベントリスナー
        li.addEventListener('click', async () => {
            await updateTodo(todo.id, { completed: !todo.completed });
            fetchTodos(); // 更新後に再取得
        });

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', async (event) => {
            event.stopPropagation(); // liクリックイベントが発火しないようにする
            await deleteTodo(todo.id);
            fetchTodos(); // 削除後に再取得
        });

        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
}

// Todoを追加する関数
todoForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ
    const text = todoInput.value.trim();
    if (text) {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            todoInput.value = ''; // 入力フィールドをクリア
            fetchTodos(); // 追加後に再取得
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }
});

// Todoを更新する関数
async function updateTodo(id, updates) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

// Todoを削除する関数
async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// ページロード時にTodoを読み込む
fetchTodos();