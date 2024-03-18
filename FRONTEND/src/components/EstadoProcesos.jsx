import React, { useState } from 'react';

const EstadoProcesos = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [pid, setPid] = useState(null);

  const startProcess = async () => {
    try {
      const response = await fetch('/start');
      const data = await response.json();
      setPid(data.pid);
      setStatusMessage(data.message);
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
      const response = await fetch(`/stop?pid=${pid}`);
      const data = await response.json();
      setStatusMessage(data.message);
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
      const response = await fetch(`/resume?pid=${pid}`);
      const data = await response.json();
      setStatusMessage(data.message);
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
      const response = await fetch(`/kill?pid=${pid}`);
      const data = await response.json();
      setStatusMessage(data.message);
      setPid(null);
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
    </div>
  );
};

export default EstadoProcesos;
