/**
 * Capa COG/GeoTIFF reutilizable para PRESAS.
 *
 * Flujo:
 * ol.source.GeoTIFF
 *      ↓
 * ol.layer.WebGLTile
 *      ↓
 * IDEE.layer.GenericRaster
 */
class RasterLayer {

    constructor(configuracion) {

        this.nombre = configuracion.nombre;
        this.url = configuracion.url;

        this.nodata = configuracion.nodata ?? 0;
        this.opacidad = configuracion.opacidad ?? 0.75;
        this.visible = configuracion.visible ?? false;
        this.estilo = configuracion.estilo ?? null;

        this.fuenteOL = null;
        this.capaOL = null;
        this.capaIDEE = null;
    }


    /**
     * Crea la fuente, la capa OpenLayers
     * y su envoltorio GenericRaster.
     */
    crear() {

        this.fuenteOL = new ol.source.GeoTIFF({
            sources: [
                {
                    url: this.url,
                    nodata: this.nodata
                }
            ],

            // Conserva los valores reales del ráster.
            normalize: false
        });


     this.capaOL = new ol.layer.WebGLTile({
            source: this.fuenteOL,
            opacity: this.opacidad,
            visible: this.visible,

            style: this.estilo,

            properties: {
                title: this.nombre
    }
});


        this.capaIDEE = new IDEE.layer.GenericRaster(
            {
                name: this.nombre,
                legend: this.nombre
            },
            {},
            this.capaOL
        );

        return this;
    }


    /**
     * Añade el GenericRaster al mapa API-IDEE.
     */
    agregarAlMapa(mapaIDEE) {

        if (!this.capaIDEE) {
            this.crear();
        }

        mapaIDEE.addLayers(this.capaIDEE);

        return this;
    }


    /**
     * Muestra u oculta la capa.
     */
    setVisible(visible) {

        if (!this.capaOL) {
            console.error(
                `La capa ráster "${this.nombre}" todavía no está creada.`
            );
            return;
        }

        this.capaOL.setVisible(visible);
        this.visible = visible;
    }


    /**
     * Cambia la opacidad entre 0 y 1.
     */
    setOpacity(opacidad) {

        if (!this.capaOL) {
            return;
        }

        const valorSeguro = Math.min(
            1,
            Math.max(0, Number(opacidad))
        );

        this.capaOL.setOpacity(valorSeguro);
        this.opacidad = valorSeguro;
    }
    /**
 * Cambia el estilo WebGL del ráster.
 */
setStyle(estilo) {

    if (!this.capaOL) {
        console.error(
            `La capa ráster "${this.nombre}" todavía no está creada.`
        );
        return;
    }

    this.estilo = estilo;
    this.capaOL.setStyle(estilo);
}


/**
 * Devuelve si la capa está visible.
 */
isVisible() {

    if (!this.capaOL) {
        return false;
    }

    return this.capaOL.getVisible();
}


/**
 * Obtiene el valor del ráster en un píxel del mapa.
 */
getData(pixel) {

    if (!this.capaOL) {
        return null;
    }

    return this.capaOL.getData(pixel);
}


    /**
     * Devuelve la fuente GeoTIFF.
     */
    getSource() {
        return this.fuenteOL;
    }


    /**
     * Devuelve la capa WebGLTile de OpenLayers.
     */
    getOLLayer() {
        return this.capaOL;
    }


    /**
     * Devuelve el GenericRaster de API-IDEE.
     */
    getIDEELayer() {
        return this.capaIDEE;
    }
}