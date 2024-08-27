const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let todos = [
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  },
  {
    "userId": 1,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false
  },
  {
    "userId": 1,
    "id": 4,
    "title": "et porro tempora",
    "completed": true
  },
  {
    "userId": 1,
    "id": 5,
    "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
    "completed": false
  },
  {
    "userId": 1,
    "id": 6,
    "title": "qui ullam ratione quibusdam voluptatem quia omnis",
    "completed": false
  },
  {
    "userId": 1,
    "id": 7,
    "title": "illo expedita consequatur quia in",
    "completed": false
  },
  {
    "userId": 1,
    "id": 8,
    "title": "quo adipisci enim quam ut ab",
    "completed": true
  },
  {
    "userId": 1,
    "id": 9,
    "title": "molestiae perspiciatis ipsa",
    "completed": false
  },
  {
    "userId": 1,
    "id": 10,
    "title": "illo est ratione doloremque quia maiores aut",
    "completed": true
  }
];

app.get('/api/getTodos', (req, res) => {
  res.send(todos);
});

app.post('/api/addTodo', (req, res) => {
  const newTodo = req.body;
  newTodo.id = todos.length ? todos[todos.length - 1].id + 1 : 1; // Assign a new id
  todos.push(newTodo);
  res.status(201).send(newTodo); // Respond with the newly created todo
});

app.put('/api/updateTodo/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTodo = req.body;
  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex !== -1) {
    todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
    res.send(todos[todoIndex]);
  } else {
    res.status(404).send({ message: 'Todo not found' });
  }
});

// DELETE API to remove a todo by id
app.delete('/api/removeTodo/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
  
    if (todoIndex !== -1) {
      const removedTodo = todos.splice(todoIndex, 1); // Remove the todo from the array
      res.send(removedTodo[0]); // Respond with the removed todo
    } else {
      res.status(404).send({ message: 'Todo not found' });
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});