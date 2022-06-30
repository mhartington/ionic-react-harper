import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import { HarperDBProvider } from './harper-provider';
const url = process.env.react_app_url!;
const userName = process.env.react_app_username!;
const password = process.env.react_app_password!;

ReactDOM.render(
  <React.StrictMode>
    <HarperDBProvider url={url} user={userName} password={password}>
      <App />
    </HarperDBProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.unregister();
reportWebVitals();
