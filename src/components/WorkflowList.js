import React, { useState, useEffect } from 'react';
import './tableStyles.css';
import { Link } from 'react-router-dom';

function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    async function fetchWorkflows() {
      const response = await fetch('https://64307b10d4518cfb0e50e555.mockapi.io/workflow');
      const data = await response.json();
      const modifiedData = data.map((workflow) => {
        return {
          id: workflow.id,
          name: workflow.name,
          input_type: workflow.input_type,
          createdAt: workflow.createdAt.slice(0, 10),
          
        };
      });
      setWorkflows(modifiedData);
      
    }
    fetchWorkflows();
  }, []);

  return (
    <div className="workflow-list">
      <h1>Workflow List</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Input Type</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow) => (
            <tr key={workflow.id}>
              <td><Link to={`/workflow/${workflow.id}`}>{workflow.name}</Link></td>
              <td>{workflow.input_type}</td>
              <td>{workflow.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkflowList;
