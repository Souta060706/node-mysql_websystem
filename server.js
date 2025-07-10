const express = require('express');
const app = express();
const port = 3000;
const path = require('path'); // 追加
app.use(express.json()); // リクエストボディをJSONとしてパースするために必要

let todos = []; // 仮のデータストア（永続化にはデータベースが必要）
let nextId = 1;

// Todoの取得
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Todoの追加
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  const newTodo = { id: nextId++, text, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Todoの更新
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  if (text !== undefined) todos[todoIndex].text = text;
  if (completed !== undefined) todos[todoIndex].completed = completed;

  res.json(todos[todoIndex]);
});

// Todoの削除
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(204).send(); // 削除成功
});

app.listen(port, () => {
  console.log(`Todo API server listening at http://localhost:${port}`);
});