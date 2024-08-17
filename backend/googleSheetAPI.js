// googleSheetsAPI.js

const { google } = require('googleapis');

const sheets = google.sheets({ version: 'v4', auth: 'TU_API_KEY' });

async function getLugares() {
  try {
    const [lugaresResponse, tiposTemativasResponse, edadesResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: 'ID_DE_TU_HOJA_DE_CALCULO',
        range: 'Hoja1!A2:E', // Ajusta según el nombre de tu hoja principal
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: 'ID_DE_TU_HOJA_DE_CALCULO',
        range: 'Hoja de referencia!A2:B', // Ajusta según el nombre de tu hoja de referencia
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: 'ID_DE_TU_HOJA_DE_CALCULO',
        range: 'Hoja de edades!A2:A', // Ajusta según el nombre de tu hoja de edades
      })
    ]);

    const lugares = lugaresResponse.data.values.map(row => ({
      nombre: row[0],
      tipo: row[1],
      tematica: row[2],
      ubicacion: row[3],
      edad: row[4]
    }));

    const tiposTematicas = processTiposTematicas(tiposTemativasResponse.data.values);
    const edades = edadesResponse.data.values.flat();

    return { lugares, tiposTematicas, edades };
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}

function processTiposTematicas(data) {
  const result = {};
  let currentTipo = '';
  data.forEach(row => {
    if (row[0]) {
      currentTipo = row[0];
      result[currentTipo] = [];
    } else if (row[1]) {
      result[currentTipo].push(row[1]);
    }
  });
  return result;
}

module.exports = { getLugares };