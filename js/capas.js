const checkPresas = document.getElementById("checkPresas");
const checkLimites = document.getElementById("checkLimites");
const checkCaladoMaximo = document.getElementById("checkCaladoMaximo");


/**
 * Activa o desactiva una capa API-IDEE.
 *
 * @param {object} capa - Capa creada con API-IDEE.
 * @param {boolean} visible - Estado de visibilidad.
 */
function cambiarVisibilidadCapa(capa, visible) {

    if (!capa) {
        console.error("La capa indicada no existe.");
        return;
    }

    const capaOpenLayers = capa
        .getImpl()
        .getOL3Layer();

    capaOpenLayers.setVisible(visible);
}


// Capa de presas
checkPresas.addEventListener("change", function () {

    cambiarVisibilidadCapa(
        capaPresas,
        checkPresas.checked
    );

});


// Límites administrativos
checkLimites.addEventListener("change", function () {

    cambiarVisibilidadCapa(
        provincias,
        checkLimites.checked
    );

});
// Calado máximo
checkCaladoMaximo.addEventListener("change", function () {

    console.log("Calado:", checkCaladoMaximo.checked);

    rasterCaladoMaximo.setVisible(
        checkCaladoMaximo.checked
    );

});