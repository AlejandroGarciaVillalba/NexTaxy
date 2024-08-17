document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tipo = document.getElementById('tipo').value;
    const tematica = document.getElementById('tematica').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const edad = document.getElementById('edad').value;

    const response = await fetch(`/lugares?tipo=${tipo}&tematica=${tematica}&ubicacion=${ubicacion}&edad=${edad}`);
    const lugares = await response.json();

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    lugares.forEach(lugar => {
        resultsDiv.innerHTML += `
            <div>
                <h2>${lugar.nombre}</h2>
                <p>Tipo: ${lugar.tipo}</p>
                <p>Temática: ${lugar.tematica}</p>
                <p>Ubicación: ${lugar.ubicacion}</p>
                <p>Edad: ${lugar.edad}</p>
            </div>
        `;
    });
});