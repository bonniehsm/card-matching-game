import React from 'react';
import { render } from 'react-dom';
import './CardGame/styles.css';
import Game from './CardGame/index.js';
import registerServiceWorker from './registerServiceWorker';

render(<Game />, document.getElementById('root'));
registerServiceWorker();
