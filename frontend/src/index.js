import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import './components/app/App.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
