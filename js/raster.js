console.log("Módulo Raster cargado");

// ======================================================
// 1. Fuente GeoTIFF / COG
// ======================================================

const fuenteCaladosCOG = new ol.source.GeoTIFF({
    sources: [
        {
            url: "datos/raster/hecras/calado_maximo.tif",
            nodata: 0
        }
    ],

    // Mantiene los valores reales de calado.
    normalize: false
});


// ======================================================
// 2. Capa OpenLayers
// ======================================================

const capaCaladosOL = new ol.layer.WebGLTile({
    source: fuenteCaladosCOG,

    opacity: 0.75,

    visible: true,

    // Nombre utilizado por algunos controles de capas.
    properties: {
        title: "Calado máximo"
    }
});


// ======================================================
// 3. Envolver la capa OL con GenericRaster
// ======================================================

const capaCalados = new IDEE.layer.GenericRaster(
    {
        name: "Calado máximo",
        legend: "Calado máximo"
    },
    {},
    capaCaladosOL
);


// ======================================================
// 4. Añadirla al mapa API-IDEE
// ======================================================

mapa.addLayers(capaCalados);

console.log("GenericRaster de calados añadido:", capaCalados);


// ======================================================
// 5. Centrar el mapa cuando el COG esté disponible
// ======================================================

fuenteCaladosCOG
    .getView()
    .then(function (vistaCOG) {

        console.log("Vista del COG:", vistaCOG);
        console.log("Proyección:", vistaCOG.projection);
        console.log("Centro:", vistaCOG.center);
        console.log("Extensión:", vistaCOG.extent);

        const mapaOL = mapa.getMapImpl();
        const vistaMapa = mapaOL.getView();

        const centroTransformado = ol.proj.transform(
            vistaCOG.center,
            vistaCOG.projection,
            vistaMapa.getProjection()
        );

        vistaMapa.setCenter(centroTransformado);
        vistaMapa.setZoom(12);

    })
    .catch(function (error) {

        console.error(
            "Error al leer la vista o proyección del COG:",
            error
        );

    });