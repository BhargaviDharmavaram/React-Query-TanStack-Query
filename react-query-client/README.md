# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

useQuery: This hook is used to fetch data from your API (in this case, a list of todos). It manages the query's state, like loading, error, and success, and handles caching, synchronization, and background updates.

useMutation: This hook is used to create, update, or delete data on the server. Unlike useQuery, it doesn't automatically cache or synchronize data, but it can trigger side effects, such as invalidating queries or updating the cache, after a successful mutation.

queryClient.invalidateQueries: This method invalidates any queries matching the given key (here, ['todos']), causing them to be refetched. This is useful after performing a mutation to ensure that the UI shows the most up-to-date data.

queryClient.setQueryData: This method allows you to update the cached data for a specific query key without making a network request. It is useful when you want to optimistically update the UI with the latest data after a mutation.

useQuery: Fetches data and manages loading and error states.
useMutation: Handles creating or updating data, with side effects (like cache invalidation) after successful mutations.
invalidateQueries: Forces a refetch of data, ensuring the UI is up-to-date.
setQueryData: Updates cached data locally, avoiding unnecessary network requests.
