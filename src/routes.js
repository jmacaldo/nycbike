import React from 'react';
import App from './containers/AppContainer';
import Share from './containers/ShareContainer';

import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routes = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route exact path="/share/:plate/:state" component={Share} />
      </div>
    </Router>
  )
};

export default Routes;
