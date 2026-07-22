(function () {
    "use strict";

    var style = document.createElement("style");

    style.textContent = `
        /*
          El JPG se coloca solamente en las caras traseras
          y en las tarjetas del mazo.
        */

        .card-back,
        .back-card {
            background-color: #0a2617 !important;

            background-image:
                url("./public/dorso-tarjeta-prehistorica.jpg")
                !important;

            background-position: center center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;

            color: transparent !important;
            font-size: 0 !important;

            border: none !important;
            border-radius: 7% !important;
            overflow: hidden !important;
        }

        /* Eliminar FÓSIL y decoraciones anteriores */

        .card-back > *,
        .back-card > * {
            opacity: 0 !important;
            visibility: hidden !important;
        }

        .card-back::before,
        .card-back::after,
        .back-card::before,
        .back-card::after {
            display: none !important;
            content: none !important;
        }

        /*
          Cuando se revela la tarjeta:
          ocultar completamente el dorso
          y mostrar la imagen frontal.
        */

        .is-revealed .card-back {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }

        .is-revealed .card-front {
            display: flex !important;

            width: 100% !important;
            height: 100% !important;

            opacity: 1 !important;
            visibility: visible !important;

            transform: none !important;
            backface-visibility: visible !important;

            align-items: center;
            justify-content: center;
        }

        .is-revealed .card-front > *,
        .is-revealed .card-front img {
            display: block !important;

            width: 100% !important;
            height: 100% !important;

            opacity: 1 !important;
            visibility: visible !important;

            object-fit: contain !important;
        }

        /*
          Limpiar cualquier aplicación anterior del JPG
          sobre el contenedor principal.
        */

        .is-revealed .selected-card,
        .is-revealed #selectedCard {
            background-image: none !important;
            background-color: transparent !important;
        }

        .is-revealed .selected-card > *,
        .is-revealed #selectedCard > * {
            opacity: 1 !important;
            visibility: visible !important;
        }

        .is-revealed .card-inner {
            width: 100% !important;
            height: 100% !important;

            opacity: 1 !important;
            visibility: visible !important;

            transform-style: flat !important;
        }
    `;

    document.head.appendChild(style);

    /*
      Eliminar propiedades en línea que pudo dejar
      la versión anterior de dorso-v14.js.
    */

    function limpiarContenedores() {
        var containers = document.querySelectorAll(
            ".selected-card, #selectedCard"
        );

        containers.forEach(function (container) {
            container.classList.remove("dorso-jpg-aplicado");

            container.removeAttribute("data-dorso-jpg");

            container.style.removeProperty("background-image");
            container.style.removeProperty("background-position");
            container.style.removeProperty("background-size");
            container.style.removeProperty("background-repeat");
            container.style.removeProperty("background-color");
            container.style.removeProperty("color");
            container.style.removeProperty("font-size");
            container.style.removeProperty("border");
        });
    }

    limpiarContenedores();

    new MutationObserver(function () {
        limpiarContenedores();
    }).observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );
})();