import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/* stylesheets */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';

/* Root app component */
import App from './app/app';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
