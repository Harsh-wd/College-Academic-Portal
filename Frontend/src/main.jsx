import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js'; 

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);



//explanation of imports
/*
import React from 'react';: This imports the React library, which is necessary 
for writing React components and using JSX syntax.

import ReactDOM from 'react-dom/client';: is used for rendering React components into the DOM.
ReactDOM.createRoot is used for concurrent mode rendering.

import './index.css';: This imports a CSS file (index.css) that contains styles for the application.

import App from './App';: This is the root component that will be rendered.



*/