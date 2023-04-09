import React from 'react';
import {  Switch, Route } from 'react-router-dom';
import WorkflowList from './components/WorkFlowList/WorkflowList';
import WorkflowDesigner from './components/WorkflowDesigner/WorkflowDesigner';

const App = () => {
  return (
    
      <Switch>
        <Route exact path="/" component={WorkflowList}  />
        <Route exact path="/workflow/:id" component={WorkflowDesigner} />
      </Switch>
   
  );
};

export default App;
