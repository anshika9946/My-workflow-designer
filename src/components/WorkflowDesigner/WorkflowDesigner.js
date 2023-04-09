// import React, { useEffect, useState } from 'react';
// import ReactFlow, { addEdge, removeElements } from 'react-flow-renderer';



// const WorkflowDesigner = ({ match }) => {
//   const [workflowData, setWorkflowData] = useState(null);
//   const [modules, setModules] = useState([]);
//   const [elements, setElements] = useState([]);

//   useEffect(() => {
//     // Load workflow data and modules on mount
//     fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/workflow/${match.params.id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setWorkflowData(data);
//         setElements([
//           {
//             id: 'input',
//             type: 'input',
//             data: {
//               label: data.input,
//             },
//             position: { x: 0, y: 50 },
//           },
//         ]);
//       });

//     fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=1&limit=5`)
//       .then((response) => response.json())
//       .then((data) => setModules(data));
//   }, [match.params.id]);

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const module = JSON.parse(event.dataTransfer.getData('application/module'));
//     const position = {
//       x: event.clientX - event.target.getBoundingClientRect().left,
//       y: event.clientY - event.target.getBoundingClientRect().top,
//     };
//     const element = {
//       id: module.id,
//       data: { label: module.name },
//       type: 'default',
//       position,
//     };
//     setElements((e) => addEdge({ ...element, source: 'input', target: element.id }, e));
//   };

//   const handleDelete = (event, element) => {
//     event.preventDefault();
//     setElements((e) => removeElements([element], e));
//   };

//   const handleValidate = (event, element) => {
//     event.preventDefault();
//     const valid = elements.some((e) => e.target === element.id);
//     setElements((e) =>
//       e.map((el) => {
//         if (el.id === element.id) {
//           el.style = {
//             border: `2px solid ${valid ? 'green' : 'red'}`,
//             ...el.style,
//           };
//         }
//         return el;
//       })
//     );
//   };

//   if (!workflowData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div onDragOver={handleDragOver} onDrop={handleDrop}>
//       <h1>{workflowData.name}</h1>
//       <ReactFlow elements={elements} onElementsRemove={handleDelete} onNodeDragStop={handleValidate} />
//       <div>
//         {modules.map((module) => (
//           <div key={module.id} draggable onDragStart={(event) => event.dataTransfer.setData('application/module', JSON.stringify(module))}>
//             {module.name}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WorkflowDesigner;

import React, { useCallback,useEffect, useState } from 'react';
import ReactFlow, { addEdge, applyNodeChanges  } from 'react-flow-renderer';



const WorkflowDesigner = ({ match }) => {
  const [workflowData, setWorkflowData] = useState(null);
  const [modules, setModules] = useState([]);
  // const [elements, setElements] = useState([]);
  const [nodes, setNodes] = useState([]);

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

    fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=1&limit=5`)
      .then((response) => response.json())
      .then((data) => setModules(data));
  }, [match.params.id]);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

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
    setNodes((e) => addEdge({ ...node, source: 'input', target: node.id }, e));
  };

 

  const handleValidate = (event, node) => {
    event.preventDefault();
    const valid = nodes.some((e) => e.target === node.id);
    setNodes((e) =>
      e.map((el) => {
        if (el.id === node.id) {
          el.style = {
            border: `2px solid ${valid ? 'green' : 'red'}`,
            ...el.style,
          };
        }
        return el;
      })
    );
  };

  if (!workflowData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }} onDragOver={handleDragOver} onDrop={handleDrop}>
      <h1>{workflowData.name}</h1>
      <ReactFlow  nodes={nodes} onNodesChange={onNodesChange} onNodeDragStop={handleValidate} />
      <div>
        {modules.map((module) => (
          <div key={module.id} draggable onDragStart={(event) => event.dataTransfer.setData('application/module', JSON.stringify(module))}>
            {module.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowDesigner;
