import React, { useState, useEffect } from 'react';
import { Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

const EstadoProcesos = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [pid, setPid] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const container = document.getElementById('network');
    const options = {
      nodes: { borderWidth: 2 },
      edges: { width: 2 }
    };
    const network = new Network(container, { nodes, edges }, options);

    return () => {
      network.destroy();
    };
  }, [nodes, edges]);

  const actualizarRed = (color) => {
    const newNodes = [
      { id: 1, label: 'Proceso', color: { border: 'black', background: color } }
    ];
    const newEdges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 1 }
    ];

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const startProcess = async () => {
    try {
      const response = await fetch('/api/start');
      const data = await response.json();
      setPid(data.pid);
      setStatusMessage(`Proceso iniciado con PID: ${data.pid}`);
      actualizarRed('green'); // Cambio de color al iniciar
    } catch (error) {
      setStatusMessage('Error al iniciar el proceso');
    }
  };

  const stopProcess = async () => {
    if (!pid) {
      setStatusMessage('No hay proceso para detener');
      return;
    }

    try {
      const response = await fetch(`/api/stop?pid=${pid}`);
      const data = await response.json();
      setStatusMessage(data.message);
      actualizarRed('yellow'); // Cambio de color al detener
    } catch (error) {
      setStatusMessage('Error al detener el proceso');
    }
  };

  const resumeProcess = async () => {
    if (!pid) {
      setStatusMessage('No hay proceso para reanudar');
      return;
    }

    try {
      const response = await fetch(`/api/resume?pid=${pid}`);
      const data = await response.json();
      setStatusMessage(data.message);
      // Agregar el cambio de color apropiado si es necesario
      actualizarRed('green');
    } catch (error) {
      setStatusMessage('Error al reanudar el proceso');
    }
  };

  const killProcess = async () => {
    if (!pid) {
      setStatusMessage('No hay proceso para terminar');
      return;
    }

    try {
      const response = await fetch(`/api/kill?pid=${pid}`);
      const data = await response.json();
      setStatusMessage(data.message);
      setPid(null);
      // Agregar el cambio de color apropiado si es necesario
      actualizarRed('red');
    } catch (error) {
      setStatusMessage('Error al terminar el proceso');
    }
  };

  return (
    <div>
      <h1>Control de Procesos</h1>
      <div>
        <button onClick={startProcess}>Crear Proceso</button>
        <button onClick={stopProcess}>Detener Proceso</button>
        <button onClick={resumeProcess}>Reanudar Proceso</button>
        <button onClick={killProcess}>Terminar Proceso</button>
      </div>
      <div>
        <p>Estado: {statusMessage}</p>
      </div>
      <div id="network" style={{ width: '600px', height: '400px' }}></div>
    </div>
  );
};

export default EstadoProcesos;
