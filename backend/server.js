// server.js

const express = require('express');
const { getLugares } = require('./googleSheetsAPI');

const app = express();
const port = 3000;

app.use(express.json());

let tiposTematicas = {};
let edadesPermitidas = [];

// Función para actualizar los datos de referencia
async function actualizarDatosReferencia() {
  try {
    const { tiposTematicas: nuevosTiposTematicas, edades } = await getLugares();
    tiposTematicas = nuevosTiposTematicas;
    edadesPermitidas = edades;
    console.log('Datos de referencia actualizados');
  } catch (error) {
    console.error('Error al actualizar datos de referencia:', error);
  }
}

// Actualizar datos de referencia al iniciar y cada hora
actualizarDatosReferencia();
setInterval(actualizarDatosReferencia, 3600000);

app.get('/lugares', async (req, res) => {
  try {
    const { lugares } = await getLugares();

    const filteredLugares = lugares.filter(lugar => {
      const tipoValido = !req.query.tipo || lugar.tipo.toLowerCase() === req.query.tipo.toLowerCase();
      const tematicaValida = !req.query.tematica || lugar.tematica.toLowerCase() === req.query.tematica.toLowerCase();
      const ubicacionValida = !req.query.ubicacion || lugar.ubicacion.toLowerCase().includes(req.query.ubicacion.toLowerCase());
      const edadValida = !req.query.edad || lugar.edad === req.query.edad;

      return tipoValido && tematicaValida && ubicacionValida && edadValida;
    });

    res.json(filteredLugares);
  } catch (error) {
    res.status(500).send('Error al obtener los datos');
  }
});

app.get('/tipos', (req, res) => {
  res.json(Object.keys(tiposTematicas));
});

app.get('/tematicas/:tipo', (req, res) => {
  const tipo = req.params.tipo;
  if (tiposTematicas[tipo]) {
    res.json(tiposTematicas[tipo]);
  } else {
    res.status(400).send('Tipo no válido');
  }
});

app.get('/edades', (req, res) => {
  res.json(edadesPermitidas);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});