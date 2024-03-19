import React, { useState, useEffect } from 'react';
import { Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

const EstadoProcesos = () => {
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    const container = document.getElementById('network');

    // Definir los nodos y las aristas
    const nodes = new vis.DataSet([
      { id: 1, label: 'Iniciado', color: 'lightblue' },
      { id: 2, label: 'Pausado', color: 'lightgreen' },
      { id: 3, label: 'Continuado', color: 'lightyellow' },
      { id: 4, label: 'Finalizado', color: 'lightgray' }
    ]);
    
    const edges = new vis.DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
      { from: 3, to: 4 }
    ]);

    // Configurar la red
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {};
    const newNetwork = new Network(container, data, options);
    setNetwork(newNetwork);
  }, []);

  const handleChangeState = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Error al cambiar el estado del proceso');
      }
      const state = await response.json();
      updateNodeColor(state);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateNodeColor = (state) => {
    const nodes = network.body.data.nodes.get();
    const updatedNodes = nodes.map(node => {
      if (node.label === state.State) {
        return { ...node, color: 'red' }; // Cambiar el color del nodo correspondiente al estado actual
      }
      return node;
    });
    network.body.data.nodes.update(updatedNodes);
  };

  return (
    <div>
      <div id="network" style={{ width: '600px', height: '400px' }}></div>
      <button onClick={() => handleChangeState('/api/start')}>Iniciar Proceso</button>
      <button onClick={() => handleChangeState('/api/stop?pid=PID_DEL_PROCESO')}>Detener Proceso</button>
      <button onClick={() => handleChangeState('/api/resume?pid=PID_DEL_PROCESO')}>Reanudar Proceso</button>
      <button onClick={() => handleChangeState('/api/kill?pid=PID_DEL_PROCESO')}>Terminar Proceso</button>
    </div>
  );
};

export default EstadoProcesos;
