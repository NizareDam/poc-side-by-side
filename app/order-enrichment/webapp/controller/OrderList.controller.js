/**
 * ============================================================================
 *  CONTRÔLEUR — Liste des commandes
 * ============================================================================
 *
 *  Gère la page principale : filtres, tri, recherche et navigation
 *  vers le détail d'une commande.
 *
 *  Les données proviennent du service OData V4 CAP (enrichi côté BTP).
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, JSONModel, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("sap.btp.orderenrichment.controller.OrderList", {

        onInit: function () {
            // Modèle local pour les KPI et l'état de la vue
            var oViewModel = new JSONModel({
                totalOrders: 0,
                highPriorityCount: 0,
                totalAmount: "0",
                avgRiskScore: 0
            });
            this.getView().setModel(oViewModel, "viewModel");

            // Calculer les KPI après le chargement
            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.attachDataReceived(this._computeKPIs.bind(this));
            } else {
                oTable.attachUpdateFinished(this._onTableUpdateFinished.bind(this));
            }
        },

        _onTableUpdateFinished: function () {
            this._computeKPIs();
        },

        /**
         * Calcule les indicateurs clés (KPI) à partir des données affichées.
         * Illustre l'enrichissement côté BTP : les KPI sont calculés
         * dynamiquement à partir des champs ajoutés (priority, riskScore).
         */
        _computeKPIs: function () {
            var oTable = this.byId("ordersTable");
            var aItems = oTable.getItems();
            var iTotal = aItems.length;
            var iHighPriority = 0;
            var fTotalAmount = 0;
            var iTotalRisk = 0;

            aItems.forEach(function (oItem) {
                var oCtx = oItem.getBindingContext();
                if (oCtx) {
                    var fAmount = parseFloat(oCtx.getProperty("amount")) || 0;
                    var sPriority = oCtx.getProperty("priority");
                    var iRisk = parseInt(oCtx.getProperty("riskScore"), 10) || 0;

                    fTotalAmount += fAmount;
                    if (sPriority === "HIGH") { iHighPriority++; }
                    iTotalRisk += iRisk;
                }
            });

            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/totalOrders", iTotal);
            oViewModel.setProperty("/highPriorityCount", iHighPriority);
            oViewModel.setProperty("/totalAmount", fTotalAmount.toLocaleString("fr-FR", { maximumFractionDigits: 0 }));
            oViewModel.setProperty("/avgRiskScore", iTotal > 0 ? Math.round(iTotalRisk / iTotal) : 0);
        },

        /**
         * Navigation vers la page de détail d'une commande.
         */
        onOrderSelect: function (oEvent) {
            var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
            var oCtx = oItem.getBindingContext();
            var sOrderID = oCtx.getProperty("ID");

            this.getOwnerComponent().getRouter().navTo("OrderDetail", {
                orderID: sOrderID
            });
        },

        /**
         * Recherche par nom de client.
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");

            var aFilters = this._buildFilters();
            if (sQuery) {
                aFilters.push(new Filter("customerName", FilterOperator.Contains, sQuery));
            }

            oBinding.filter(aFilters.length > 0 ? new Filter({ filters: aFilters, and: true }) : []);
            // Recalcul KPI après filtrage
            setTimeout(this._computeKPIs.bind(this), 500);
        },

        /**
         * Filtre par statut ou priorité.
         */
        onFilterChange: function () {
            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = this._buildFilters();

            oBinding.filter(aFilters.length > 0 ? new Filter({ filters: aFilters, and: true }) : []);
            setTimeout(this._computeKPIs.bind(this), 500);
        },

        _buildFilters: function () {
            var aFilters = [];
            var sStatus = this.byId("statusFilter").getSelectedKey();
            var sPriority = this.byId("priorityFilter").getSelectedKey();

            if (sStatus && sStatus !== "ALL") {
                aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
            }
            if (sPriority && sPriority !== "ALL") {
                aFilters.push(new Filter("priority", FilterOperator.EQ, sPriority));
            }
            return aFilters;
        },

        /**
         * Tri dynamique des commandes.
         */
        onSortChange: function (oEvent) {
            var sKey = oEvent.getSource().getSelectedKey();
            var aParts = sKey.split("-");
            var sPath = aParts[0];
            var bDescending = aParts[1] === "desc";

            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");
            oBinding.sort(new Sorter(sPath, bDescending));
        }
    });
});
