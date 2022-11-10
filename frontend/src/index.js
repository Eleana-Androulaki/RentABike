import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider as AppProvider } from './context/appContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <App/>
  </AppProvider>
);

reportWebVitals();
