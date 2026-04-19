/**
 * ============================================================================
 *  COUCHE SAP BTP — Service OData V4
 * ============================================================================
 *
 *  Ce service expose les données enrichies au frontend SAPUI5.
 *
 *  Il combine :
 *   - les données ERP (simulées) via une projection sur l'entité Orders
 *   - une action/function side-by-side pour simuler un appel externe
 *
 *  Dans un projet réel, ce service CAP consommerait un "remote service"
 *  S/4HANA (via destination BTP) et ajouterait la logique métier dessus.
 *
 * ============================================================================
 */
using { sap.btp.orders as db } from '../db/schema';

service OrderEnrichmentService @(path: '/api') {

    /**
     * Projection sur les commandes — enrichies côté BTP
     * avec les champs priority et riskScore calculés par le handler.
     */
    entity Orders as projection on db.Orders;

    /**
     * ---- SIMULATION D'INTÉGRATION EXTERNE ----
     *
     * Cette function simule un appel à un système de suivi de livraison
     * externe (ex : transporteur, TMS, plateforme logistique).
     *
     * Dans un projet réel, cela pourrait être :
     *  - un appel REST vers une API tierce
     *  - un appel à un microservice sur SAP BTP (Kyma, Cloud Foundry)
     *  - une intégration via SAP Integration Suite
     */
    function getDeliveryStatus(orderID : UUID) returns {
        orderID     : UUID;
        carrier     : String;
        trackingNo  : String;
        status      : String;
        estimatedDelivery : String;
        lastUpdate  : String;
    };
}
