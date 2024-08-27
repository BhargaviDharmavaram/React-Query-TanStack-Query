

// A query can only be in one of the following states at any given moment:

// isPending or status === 'pending' - The query has no data yet
// isError or status === 'error' - The query encountered an error
// isSuccess or status === 'success' - The query was successful and data is available

// Beyond those primary states, more information is available depending on the state of the query:
// error - If the query is in an isError state, the error is available via the error property.
// data - If the query is in an isSuccess state, the data is available via the data property.
// isFetching - In any state, if the query is fetching at any time (including background refetching) isFetching will be true.

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchTodos = async () => {
  const { data } = await axios.get("http://localhost:5000/api/getTodos");
  return data;
};

const addTodo = async (newTodo) => {
  const { data } = await axios.post('http://localhost:5000/api/addTodo', newTodo, {
    headers: { 'Content-type': 'application/json' }
  });
  return data;
};

const updateTodo = async ({ id, updatedTodo }) => {
  const { data } = await axios.put(`http://localhost:5000/api/updateTodo/${id}`, updatedTodo, {
    headers: { 'Content-type': 'application/json' }
  });
  return data;
};

const removeTodo =async (id) => {
  console.log(id,'id-remove-api')
  const {data} = await axios.delete(`http://localhost:5000/api/removeTodo/${id}`)
  return data
}

function App() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState('');

  // Queries
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
  

  // Mutation to add a new todo
  const { mutate: addTodoMutate, isError: isErrorAdd, isLoading: isPendingAdd } = useMutation({
    mutationFn: addTodo,
    // onSuccess: (newTodo) => {
    //   queryClient.setQueryData(['todos'], (oldData) => [...oldData, newTodo]);
    // }
    onSuccess:()=>{
       // Invalidate and refetch
      //  When a successful postTodo mutation happens, we likely want all todos queries to get invalidated and possibly refetched to show the new todo item. To do this, you can use useMutation's onSuccess options and the client's invalidateQueries function:
      queryClient.invalidateQueries({queryKey: ['todos']})
    }
  });
  // --------------- update - Updates from Mutation Responses -------------------
  // When dealing with mutations that update objects on the server, it's common for the new object to be automatically returned in the response of the mutation. Instead of refetching any queries for that item and wasting a network call for data we already have, we can take advantage of the object returned by the mutation function and update the existing query with the new data immediately using the Query Client's setQueryData method

  // Mutation to update a todo
  const { mutate: updateTodoMutate, isError: isErrorUpdate, isLoading: isPendingUpdate } = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodo) => {
       // Update the query data immutably - Updates via setQueryData must be performed in an immutable way. DO NOT attempt to write directly to the cache by mutating data (that you retrieved from the cache) in place. It might work at first but can lead to subtle bugs along the way.
      queryClient.setQueryData(['todos'], (oldData) => {
         // Create a new array with updated todo
        return oldData.map(todo => todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo);
      });
    }
    // onSuccess:()=>{
    //   //if i use this method it will make 2 apis (getTodos, and update api)
    //   queryClient.invalidateQueries({queryKey: ['todos']})
    // }
  });


   // Mutation to remove a todo
   const { mutate: removeTodoMutate } = useMutation({
    mutationFn: removeTodo,
    onSuccess: (removedTodo) => {
      queryClient.setQueryData(['todos'], (oldData) => {
        return oldData.filter(todo => todo.id !== removedTodo.id); // Remove the deleted todo from the cached data
      });
    },
    // onSuccess: () => {
    //   // Invalidate the todos query to refetch and remove the deleted todo from the UI
    //   queryClient.invalidateQueries({ queryKey: ['todos'] });
    // },
  });

  const handleAddSubmit = (event) => {
    event.preventDefault();
    if (newTodo.trim()) {
      addTodoMutate({ title: newTodo, completed: false, userId: 1 });
      setNewTodo('');
    }
  };

  const handleEdit = (todo) => {
    const newTitle = prompt("Enter new title:", todo.title);
    if (newTitle) {
      updateTodoMutate({ id: todo.id, updatedTodo: { title: newTitle } });
    }
  };

  const handleRemove = (id) => {
    console.log(id,'id-remove')
    if (window.confirm("Are you sure you want to delete this todo?")) {
      removeTodoMutate(id);
    }
  };

  if (isLoading || isPendingAdd || isPendingUpdate) {
    return <div>Data is being added or loading.....</div>;
  }

  if (isError || isErrorAdd || isErrorUpdate) {
    return <div>Error fetching data: {error?.message}</div>;
  }

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <h1>React Query</h1>
      <h3>Total Todos : {data?.length || 0} </h3>
      <form onSubmit={handleAddSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
        <button type="submit">Add Todo</button>
      </form>
      {data?.map((todo) => (
        <div key={todo.id}>
          <h4>ID: {todo.id}</h4>
          <h4>Title: {todo.title}</h4>
          <button onClick={() => handleEdit(todo)}>Edit</button>
          <button onClick={() => handleRemove(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;


// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';

// // Function to fetch todos from the server
// const fetchTodos = async () => {
//   const { data } = await axios.get("http://localhost:5000/api/getTodos");
//   return data; // Returning the data to be used in the `useQuery` hook
// };

// // Function to add a new todo to the server
// const addTodo = async (newTodo) => {
//   const { data } = await axios.post('http://localhost:5000/api/addTodo', newTodo, {
//     headers: { 'Content-type': 'application/json' }
//   });
//   return data; // Returning the data to be used in the `useMutation` hook
// };

// // Function to update an existing todo on the server
// const updateTodo = async ({ id, updatedTodo }) => {
//   const { data } = await axios.put(`http://localhost:5000/api/updateTodo/${id}`, updatedTodo, {
//     headers: { 'Content-type': 'application/json' }
//   });
//   return data; // Returning the updated data to be used in the `useMutation` hook
// };

// function App() {
//   const queryClient = useQueryClient(); // Accessing the query client to manage cache and queries
//   const [newTodo, setNewTodo] = useState(''); // Local state to handle the new todo input

//   // Queries
//   const { data, isError, isLoading, error } = useQuery({
//     queryKey: ['todos'], // Unique key for caching and identifying the query
//     queryFn: fetchTodos, // Function to fetch todos
//   });

//   // Mutation to add a new todo
//   const { mutate: addTodoMutate, isError: isErrorAdd, isLoading: isPendingAdd } = useMutation({
//     mutationFn: addTodo, // Function to add a new todo
//     onSuccess: () => {
//       // When the mutation is successful, invalidate the `todos` query to refetch and show the updated list
//       queryClient.invalidateQueries({ queryKey: ['todos'] });
//     },
//   });

//   // Mutation to update a todo
//   const { mutate: updateTodoMutate, isError: isErrorUpdate, isLoading: isPendingUpdate } = useMutation({
//     mutationFn: updateTodo, // Function to update an existing todo
//     onSuccess: (updatedTodo) => {
//       // Update the cached data for the `todos` query with the updated todo data
//       queryClient.setQueryData(['todos'], (oldData) => {
//         // Create a new array with the updated todo, maintaining immutability
//         return oldData.map(todo => todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo);
//       });
//     },
//   });

//   // Handler for adding a new todo
//   const handleAddSubmit = (event) => {
//     event.preventDefault(); // Prevent form submission from refreshing the page
//     if (newTodo.trim()) { // Check if the input is not empty
//       addTodoMutate({ title: newTodo, completed: false, userId: 1 }); // Trigger the mutation to add a new todo
//       setNewTodo(''); // Clear the input field
//     }
//   };

//   // Handler for editing a todo
//   const handleEdit = (todo) => {
//     const newTitle = prompt("Enter new title:", todo.title); // Prompt user for the new title
//     if (newTitle) {
//       updateTodoMutate({ id: todo.id, updatedTodo: { title: newTitle } }); // Trigger the mutation to update the todo
//     }
//   };

//   // If any data is loading, show a loading message
//   if (isLoading || isPendingAdd || isPendingUpdate) {
//     return <div>Data is being added or loading.....</div>;
//   }

//   // If there was an error in any query or mutation, show an error message
//   if (isError || isErrorAdd || isErrorUpdate) {
//     return <div>Error fetching data: {error?.message}</div>;
//   }

//   // Render the list of todos and the form to add a new one
//   return (
//     <div className="App">
//       <h1>React Query</h1>
//       <form onSubmit={handleAddSubmit}>
//         <input
//           type="text"
//           value={newTodo} // Controlled input for the new todo
//           onChange={(e) => setNewTodo(e.target.value)} // Update the state when input changes
//           placeholder="Enter new todo"
//         />
//         <button type="submit">Add Todo</button>
//       </form>
//       {data?.map((todo) => (
//         <div key={todo.id}>
//           <h4>ID: {todo.id}</h4>
//           <h4>Title: {todo.title}</h4>
//           <button onClick={() => handleEdit(todo)}>Edit</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default App;
