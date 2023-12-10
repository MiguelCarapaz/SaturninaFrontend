import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot desde "react-dom/client"
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App';

const root = document.getElementById('root');
const reactRoot = createRoot(root)

reactRoot.render(
  <Provider store={store}>
    <App />
  </Provider>
);
