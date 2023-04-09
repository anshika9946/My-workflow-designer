import React, { useCallback,useEffect, useState } from 'react';
import ReactFlow, {  addEdge, applyEdgeChanges, applyNodeChanges } from 'react-flow-renderer';

const WorkflowDesigner = ({ match }) => {
  const [workflowData, setWorkflowData] = useState(null);
  const [modules, setModules] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    // Load workflow data and modules on mount
    fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/workflow/${match.params.id}`)
      .then((response) => response.json())
      .then((data) => {
        setWorkflowData(data);
        setNodes([
          {
            id: 'input',
            type: 'input',
            data: {
              label: data.input,
            },
            position: { x: 0, y: 50 },
          },
        ]);
      });

    fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/workflow?page=1&limit=5`)
      .then((response) => response.json())
      .then((data) => setModules(data));
  }, [match.params.id]);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const module = JSON.parse(event.dataTransfer.getData('application/module'));
    const position = {
      x: event.clientX - event.target.getBoundingClientRect().left,
      y: event.clientY - event.target.getBoundingClientRect().top,
    };
    const node = {
      id: module.id,
      data: { label: module.name },
      type: 'default',
      position,
    };
    setNodes((n) => [...n, node]);
    setEdges((e) => [
      ...e,
      {
        id: `e${nodes.length}-${module.id}`,
        source: 'input',
        target: module.id,
        animated: true,
      },
    ]);
  };
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  // const handleDelete = (event, element) => {
  //   event.preventDefault();
  //   if (element.type === 'node') {
  //     setNodes((n) => n.filter((node) => node.id !== element.id));
  //     setEdges((e) => e.filter((edge) => edge.source !== element.id && edge.target !== element.id));
  //   } else {
  //     setEdges((e) => e.filter((edge) => edge.id !== element.id));
  //   }
  // };

  const handleValidate = (event, element) => {
    event.preventDefault();
    const valid = edges.some((e) => e.target === element.id);
    if (element.type === 'node') {
      setNodes((n) =>
        n.map((node) => {
          if (node.id === element.id) {
            node.style = {
              border: `2px solid ${valid ? 'green' : 'red'}`,
              ...node.style,
            };
          }
          return node;
        })
      );
    } else {
      setEdges((e) =>
        e.map((edge) => {
          if (edge.id === element.id) {
            edge.animated = valid;
          }
          return edge;
        })
      );
    }
  };

  if (!workflowData) {
    return <div>Loading...</div>;
  }

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <h1>{workflowData.name}</h1>
      <ReactFlow elements={[...nodes, ...edges]}  nodes={nodes}
      edges={edges} onConnect={onConnect} onEdgesChange={onEdgesChange} onNodesChange={onNodesChange} onNodeDragStop={handleValidate}/>



        {modules.map((module) => (
          <div key={module.id} draggable onDragStart={(event) => event.dataTransfer.setData('application/module', JSON.stringify(module))}>
            {module.name}
          </div>
        ))}
   
    </div>
  );
};

export default WorkflowDesigner;
