import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" />
        <Route exact path="/workflow/:id"  />
      </Switch>
    </Router>
  );
};

export default App;
