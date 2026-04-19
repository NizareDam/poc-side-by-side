/**
 * ============================================================================
 *  CONTRÔLEUR — Détail d'une commande
 * ============================================================================
 *
 *  Gère la page de détail avec :
 *   - le binding OData V4 sur la commande sélectionnée
 *   - l'appel à la function getDeliveryStatus (intégration externe simulée)
 *   - la navigation retour vers la liste
 *
 *  Ce contrôleur illustre comment une application SAPUI5 consomme
 *  un service CAP enrichi côté SAP BTP.
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("sap.btp.orderenrichment.controller.OrderDetail", {

        onInit: function () {
            // Modèle local pour les données de livraison (intégration externe)
            var oDeliveryModel = new JSONModel({
                carrier: "",
                trackingNo: "",
                status: "",
                estimatedDelivery: "",
                lastUpdate: ""
            });
            this.getView().setModel(oDeliveryModel, "deliveryModel");

            // Écouter la navigation vers cette page
            this.getOwnerComponent().getRouter()
                .getRoute("OrderDetail")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        /**
         * Déclenché lorsque la route OrderDetail est atteinte.
         * Bind la commande et charge le statut de livraison.
         */
        _onRouteMatched: function (oEvent) {
            var sOrderID = oEvent.getParameter("arguments").orderID;
            this._sOrderID = sOrderID;

            // Binding OData V4 sur la commande
            var sPath = "/Orders(" + sOrderID + ")";
            this.getView().bindElement({
                path: sPath
            });

            // Charger le statut de livraison (intégration externe simulée)
            this._loadDeliveryStatus(sOrderID);
        },

        /**
         * ================================================================
         *  INTÉGRATION EXTERNE — Appel au service de livraison
         * ================================================================
         *
         *  Appelle la function CAP getDeliveryStatus qui simule
         *  un appel à un service tiers (transporteur, TMS).
         *
         *  Dans un vrai projet, cette function CAP appellerait
         *  une API REST externe via SAP Integration Suite ou
         *  directement via le CAP SDK.
         */
        _loadDeliveryStatus: function (sOrderID) {
            var that = this;
            var sUrl = "/api/getDeliveryStatus(orderID=" + sOrderID + ")";

            // Appel direct fetch pour la function import OData
            fetch(sUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    var oDeliveryModel = that.getView().getModel("deliveryModel");
                    oDeliveryModel.setData({
                        carrier:           data.carrier || "N/A",
                        trackingNo:        data.trackingNo || "N/A",
                        status:            data.status || "Inconnu",
                        estimatedDelivery: data.estimatedDelivery || "N/A",
                        lastUpdate:        data.lastUpdate || "N/A"
                    });
                })
                .catch(function () {
                    MessageToast.show("Impossible de charger le statut de livraison.");
                });
        },

        /**
         * Rafraîchit le statut de livraison.
         */
        onRefreshDelivery: function () {
            if (this._sOrderID) {
                this._loadDeliveryStatus(this._sOrderID);
                MessageToast.show("Statut de livraison actualisé.");
            }
        },

        /**
         * Navigation retour vers la liste des commandes.
         */
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("OrderList");
        }
    });
});
