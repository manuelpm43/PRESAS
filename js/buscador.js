const inputBuscador = document.getElementById("buscador");
const panelSugerencias = document.getElementById("sugerencias");

let datosPresas = [];


/* Carga de datos para el buscador */
fetch("datos/geojson/puntos/presas.geojson")
    .then(function (respuesta) {

        if (!respuesta.ok) {
            throw new Error(
                `No se pudo cargar el GeoJSON: ${respuesta.status}`
            );
        }

        return respuesta.json();
    })
    .then(function (geojson) {

        datosPresas = geojson.features;

        console.log(
            "Presas disponibles en el buscador:",
            datosPresas
        );

    })
    .catch(function (error) {

        console.error(
            "Error al cargar las presas:",
            error
        );

    });


/* Mostrar sugerencias mientras se escribe */
inputBuscador.addEventListener("input", function () {

    const textoBuscado = normalizarTexto(
        inputBuscador.value
    );

    panelSugerencias.innerHTML = "";

    if (textoBuscado === "") {
        ocultarSugerencias();
        return;
    }

    const resultados = datosPresas
        .filter(function (presa) {

            const nombre = normalizarTexto(
                presa.properties.NOMBRE ?? ""
            );

            return nombre.includes(textoBuscado);

        })
        .slice(0, 8);

    if (resultados.length === 0) {

        panelSugerencias.innerHTML = `
            <div class="sugerencia-vacia">
                No se encontraron presas
            </div>
        `;

        mostrarSugerencias();
        return;
    }

    resultados.forEach(function (presa) {

        const elemento = document.createElement("button");

        elemento.type = "button";
        elemento.className = "sugerencia-presa";
        elemento.textContent =
            presa.properties.NOMBRE ?? "Sin nombre";

        elemento.addEventListener("click", function () {

            seleccionarPresa(presa);

        });

        panelSugerencias.appendChild(elemento);

    });

    mostrarSugerencias();

});


/* Buscar al pulsar Enter */
inputBuscador.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {
        ocultarSugerencias();
        return;
    }

    if (evento.key !== "Enter") {
        return;
    }

    const textoBuscado = normalizarTexto(
        inputBuscador.value
    );

    if (textoBuscado === "") {
        return;
    }

    const presaEncontrada = datosPresas.find(
        function (presa) {

            const nombre = normalizarTexto(
                presa.properties.NOMBRE ?? ""
            );

            return nombre.includes(textoBuscado);

        }
    );

    if (!presaEncontrada) {
        alert(
            "No se ha encontrado ninguna presa con ese nombre."
        );
        return;
    }

    seleccionarPresa(presaEncontrada);

});


/* Cerrar sugerencias al pulsar fuera */
document.addEventListener("click", function (evento) {

    const contenedor = document.querySelector(
        ".contenedor-buscador"
    );

    if (!contenedor.contains(evento.target)) {
        ocultarSugerencias();
    }

});


function seleccionarPresa(presa) {

    const atributos = presa.properties;

    const longitud =
        presa.geometry.coordinates[0];

    const latitud =
        presa.geometry.coordinates[1];

    const coordenadasWebMercator =
        convertirAWEBMercator(
            longitud,
            latitud
        );

    mapa.setCenter(coordenadasWebMercator);
    mapa.setZoom(14);

    mostrarFichaPresa(atributos);

    inputBuscador.value =
        atributos.NOMBRE ?? "";

    ocultarSugerencias();

}


function mostrarSugerencias() {
    panelSugerencias.classList.add("visible");
}


function ocultarSugerencias() {
    panelSugerencias.classList.remove("visible");
}


function normalizarTexto(texto) {

    return texto
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


function convertirAWEBMercator(longitud, latitud) {

    const radioTierra = 6378137;

    const x =
        radioTierra *
        longitud *
        Math.PI /
        180;

    const y =
        radioTierra *
        Math.log(
            Math.tan(
                Math.PI / 4 +
                latitud *
                Math.PI /
                360
            )
        );

    return [x, y];

}