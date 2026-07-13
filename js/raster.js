console.log("Módulo Raster cargado");


// ======================================================
// PALETAS DE CALADO
// ======================================================

const paletasCalado = {

    hidraulica: {
        color: [
            "case",

            ["<=", ["band", 1], 0],
            [0, 0, 0, 0],

            [
                "interpolate",
                ["linear"],
                ["band", 1],

                0.01,
                [198, 239, 255, 0.80],

                0.50,
                [93, 192, 255, 0.85],

                1.00,
                [25, 118, 210, 0.90],

                2.00,
                [86, 62, 180, 0.92],

                4.00,
                [220, 55, 70, 0.95],

                6.00,
                [80, 0, 35, 1]
            ]
        ]
    },


    azules: {
        color: [
            "case",

            ["<=", ["band", 1], 0],
            [0, 0, 0, 0],

            [
                "interpolate",
                ["linear"],
                ["band", 1],

                0.01,
                [225, 245, 255, 0.75],

                0.50,
                [140, 210, 245, 0.82],

                1.00,
                [65, 160, 220, 0.88],

                2.00,
                [20, 95, 180, 0.94],

                4.00,
                [5, 45, 105, 1]
            ]
        ]
    },


    grises: {
        color: [
            "case",

            ["<=", ["band", 1], 0],
            [0, 0, 0, 0],

            [
                "interpolate",
                ["linear"],
                ["band", 1],

                0.01,
                [245, 245, 245, 0.75],

                1.00,
                [190, 190, 190, 0.85],

                2.00,
                [125, 125, 125, 0.92],

                4.00,
                [55, 55, 55, 1]
            ]
        ]
    }

};


// ======================================================
// CAPA DE CALADO MÁXIMO
// ======================================================

const rasterCaladoMaximo = new RasterLayer({

    nombre: "Calado máximo",

    url: "datos/raster/hecras/calado_maximo.tif",

    nodata: 0,

    opacidad: 0.80,

    visible: true,

    estilo: paletasCalado.hidraulica

});


rasterCaladoMaximo.agregarAlMapa(mapa);


console.log(
    "Raster de calado máximo añadido:",
    rasterCaladoMaximo
);


// ======================================================
// ELEMENTOS DE LA INTERFAZ
// ======================================================

const btnPaletaCalado =
    document.getElementById("btnPaletaCalado");

const panelPaletaCalado =
    document.getElementById("panelPaletaCalado");

const selectPaletaCalado =
    document.getElementById("selectPaletaCalado");

const sliderOpacidadCalado =
    document.getElementById("sliderOpacidadCalado");

const valorOpacidadCalado =
    document.getElementById("valorOpacidadCalado");

const btnConsultarCalado =
    document.getElementById("btnConsultarCalado");

const btnLeyendaCalado =
    document.getElementById("btnLeyendaCalado");

const leyendaCalado =
    document.getElementById("leyendaCalado");


let consultaCaladoActiva = false;


// ======================================================
// PALETA
// ======================================================

btnPaletaCalado.addEventListener("click", function () {

    panelPaletaCalado.hidden =
        !panelPaletaCalado.hidden;

});


selectPaletaCalado.addEventListener("change", function () {

    const nombrePaleta =
        selectPaletaCalado.value;

    const estilo =
        paletasCalado[nombrePaleta];

    if (!estilo) {
        console.error(
            `No existe la paleta "${nombrePaleta}".`
        );
        return;
    }

    rasterCaladoMaximo.setStyle(estilo);

});


// ======================================================
// OPACIDAD
// ======================================================

sliderOpacidadCalado.addEventListener("input", function () {

    const porcentaje =
        Number(sliderOpacidadCalado.value);

    const opacidad =
        porcentaje / 100;

    rasterCaladoMaximo.setOpacity(opacidad);

    valorOpacidadCalado.textContent =
        `${porcentaje} %`;

});


// ======================================================
// CONSULTA DEL VALOR DEL PÍXEL
// ======================================================

btnConsultarCalado.addEventListener("click", function () {

    consultaCaladoActiva =
        !consultaCaladoActiva;

    btnConsultarCalado.classList.toggle(
        "activo",
        consultaCaladoActiva
    );

    btnConsultarCalado.setAttribute(
        "aria-pressed",
        String(consultaCaladoActiva)
    );

    btnConsultarCalado.title =
        consultaCaladoActiva
            ? "Desactivar consulta de calado"
            : "Consultar valor del calado";

});


mapa.on("click", function (evento) {

    if (!consultaCaladoActiva) {
        return;
    }

    if (!rasterCaladoMaximo.isVisible()) {
        return;
    }

    const datos =
        rasterCaladoMaximo.getData(evento.pixel);

    if (!datos || datos.length === 0) {
        mostrarValorCalado(null);
        return;
    }

    const calado =
        Number(datos[0]);

    if (!Number.isFinite(calado) || calado <= 0) {
        mostrarValorCalado(0);
        return;
    }

    mostrarValorCalado(calado);

});


function mostrarValorCalado(calado) {

    const panelInfo =
        document.getElementById("info");

    let consultaRaster =
        document.getElementById("consultaRaster");

    if (!consultaRaster) {

        consultaRaster =
            document.createElement("div");

        consultaRaster.id =
            "consultaRaster";

        consultaRaster.className =
            "consulta-raster";

        panelInfo.appendChild(consultaRaster);

    }

    if (calado === null) {

        consultaRaster.innerHTML = `
            <h3>🌊 Consulta de calado</h3>
            <p>No se pudo leer el valor.</p>
        `;

        return;
    }

    if (calado <= 0) {

        consultaRaster.innerHTML = `
            <h3>🌊 Consulta de calado</h3>
            <p><b>Calado:</b> sin inundación</p>
        `;

        return;
    }

    consultaRaster.innerHTML = `
        <h3>🌊 Consulta de calado</h3>

        <p>
            <b>Calado máximo:</b>
            ${calado.toFixed(2)} m
        </p>
    `;

}


// ======================================================
// LEYENDA
// ======================================================

btnLeyendaCalado.addEventListener("click", function () {

    leyendaCalado.hidden =
        !leyendaCalado.hidden;

});