import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

//The QueryClient class from React Query is used to configure and manage the state of queries and mutations. 
//create an instance of QueryClient
const queryClient = new QueryClient({})

//queryclientprovider

//client: Required to pass the QueryClient instance.
//children: Required to wrap your components that will use React Query hooks.
//The QueryClientProvider ensures that all the React Query hooks within its child components have access to the same QueryClient instance and its configuration.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
