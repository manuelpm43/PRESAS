function mostrarFichaPresa(atributos) {

    const panelInfo = document.getElementById("info");

    panelInfo.innerHTML = `
        <h2>ℹ Información</h2>

        <div class="ficha-presa-panel">
            <h3>🏞 ${atributos.NOMBRE ?? "Sin nombre"}</h3>

            <p><b>Río:</b> ${atributos.RIO ?? "-"}</p>
            <p><b>Cuenca:</b> ${atributos.CUENCA_HIDROGRAFICA ?? "-"}</p>
            <p><b>Área cuenca:</b> ${atributos.AREA_CUENCA ?? "-"} km²</p>
            <p><b>Tipo:</b> ${atributos.TIPO ?? "-"}</p>
            <p><b>Cota coronación:</b> ${atributos.COTA_CORONACION ?? "-"} m</p>
            <p><b>NME:</b> ${atributos.NME ?? "-"} m</p>
        </div>
    `;
}