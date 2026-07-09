const mapa = IDEE.map({
    container: 'mapa',
    zoom: 5,
    center: [-467062.8225, 4983459.6216]
});
console.log(mapa);
const provincias = new IDEE.layer.WMS({
    url: "https://www.ign.es/wms-inspire/unidades-administrativas?",
    name: "AU.AdministrativeUnit",
    legend: "Provincias"
});
mapa.addLayers(provincias);
const capaPresas = new IDEE.layer.GeoJSON({

    url: "datos/geojson/puntos/presas.geojson",

    name: "Presas",

    extract: false,



});

mapa.addLayers(capaPresas);
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
mapa.on("click", function(evento) {

    const pixel = evento.pixel;
    const mapaOL = evento.vendor.map;

    let encontrada = false;

    mapaOL.forEachFeatureAtPixel(pixel, function(feature) {

        encontrada = true;

        console.log("FEATURE:", feature);
        console.log("PROPIEDADES:", feature.getProperties());

        const propiedades = feature.getProperties();

        delete propiedades.geometry;

        mostrarFichaPresa(propiedades);

    });

    if (!encontrada) {
        console.log("No hay presa en este punto");
    }

});

