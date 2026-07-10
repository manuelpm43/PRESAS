const inputBuscador = document.getElementById("buscador");

// Aquí guardaremos las presas cargadas desde el GeoJSON.
let datosPresas = [];

// Cargar el GeoJSON una sola vez al iniciar el visor.
fetch("datos/geojson/puntos/presas.geojson")
    .then(function (respuesta) {
        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar el GeoJSON: ${respuesta.status}`);
        }

        return respuesta.json();
    })
    .then(function (geojson) {
        datosPresas = geojson.features;
        console.log("Presas disponibles en el buscador:", datosPresas);
    })
    .catch(function (error) {
        console.error("Error al cargar las presas:", error);
    });

inputBuscador.addEventListener("keydown", function (evento) {

    if (evento.key !== "Enter") {
        return;
    }

    const textoBuscado = inputBuscador.value
        .trim()
        .toUpperCase();

    if (textoBuscado === "") {
        return;
    }

    const presaEncontrada = datosPresas.find(function (presa) {

        const nombre = presa.properties.NOMBRE ?? "";

        return nombre
            .toUpperCase()
            .includes(textoBuscado);
    });

    if (!presaEncontrada) {
        alert("No se ha encontrado ninguna presa con ese nombre.");
        return;
    }

    const atributos = presaEncontrada.properties;

    // GeoJSON guarda las coordenadas como longitud y latitud.
    const longitud = presaEncontrada.geometry.coordinates[0];
    const latitud = presaEncontrada.geometry.coordinates[1];

    // Transformación de EPSG:4326 a EPSG:3857.
    const coordenadasWebMercator = convertirAWEBMercator(
        longitud,
        latitud
    );

    mapa.setCenter(coordenadasWebMercator);
    mapa.setZoom(14);

    mostrarFichaPresa(atributos);
});


function convertirAWEBMercator(longitud, latitud) {

    const radioTierra = 6378137;

    const x = radioTierra * longitud * Math.PI / 180;

    const y = radioTierra * Math.log(
        Math.tan(
            Math.PI / 4 +
            latitud * Math.PI / 360
        )
    );

    return [x, y];
}