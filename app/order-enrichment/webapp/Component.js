/**
 * Composant principal de l'application Order Enrichment Dashboard.
 *
 * Ce composant initialise le routeur et sert de point d'entrée
 * pour l'application SAPUI5 Fiori freestyle.
 */
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.btp.orderenrichment.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});
