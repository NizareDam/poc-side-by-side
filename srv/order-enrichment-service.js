/**
 * ============================================================================
 *  COUCHE SAP BTP — Logique métier side-by-side (Handler CAP)
 * ============================================================================
 *
 *  Ce fichier contient toute la logique métier spécifique ajoutée
 *  côté SAP BTP, qui n'existe PAS dans le standard S/4HANA.
 *
 *  C'est ici que réside la valeur de l'extension side-by-side :
 *   1. Priorisation métier  → champ "priority"
 *   2. Scoring de risque     → champ "riskScore"
 *   3. Intégration externe   → function "getDeliveryStatus"
 *
 *  Dans un vrai projet, les données brutes viendraient de S/4HANA
 *  via API, et ce handler les enrichirait avant de les exposer au frontend.
 *
 * ============================================================================
 */
const cds = require('@sap/cds');

module.exports = class OrderEnrichmentService extends cds.ApplicationService {

    init() {

        const { Orders } = this.entities;

        /**
         * ================================================================
         *  ENRICHISSEMENT 1 — Priorisation métier
         * ================================================================
         *
         *  Règle métier spécifique à l'entreprise (n'existe pas dans S/4HANA) :
         *   - HIGH     : montant > 10 000 €
         *   - MEDIUM   : montant entre 1 000 € et 10 000 €
         *   - NORMAL   : montant ≤ 1 000 €
         *
         *  Cette logique pourrait intégrer d'autres critères :
         *   - type de client (stratégique / standard)
         *   - délai de livraison demandé
         *   - historique de commandes
         */
        function computePriority(amount) {
            if (amount > 10000) return 'HIGH';
            if (amount > 1000)  return 'MEDIUM';
            return 'NORMAL';
        }

        /**
         * ================================================================
         *  ENRICHISSEMENT 2 — Score de risque
         * ================================================================
         *
         *  Algorithme simplifié de scoring (0–100) basé sur :
         *   - le montant de la commande (pondération principale)
         *   - le statut de la commande (malus si "En attente" ou "Annulée")
         *
         *  Dans un vrai projet, ce score pourrait être calculé par
         *  un modèle ML déployé sur SAP AI Core / AI Launchpad.
         */
        function computeRiskScore(amount, status) {
            let score = 0;

            // Composante montant (0-60 pts)
            if (amount > 50000)      score += 60;
            else if (amount > 10000) score += 40;
            else if (amount > 1000)  score += 20;
            else                     score += 10;

            // Composante statut (0-40 pts)
            if (status === 'Annulée')    score += 40;
            if (status === 'En attente') score += 25;
            if (status === 'En cours')   score += 10;
            // 'Confirmée' → pas de malus

            return Math.min(score, 100);
        }

        /**
         *  Handler AFTER READ — enrichit les données lues depuis la couche ERP (mock)
         *  avec les champs calculés côté BTP.
         *
         *  >>> C'est ici que se matérialise concrètement le side-by-side :
         *      les données ERP brutes passent par la logique BTP
         *      avant d'être exposées au consommateur (frontend SAPUI5).
         */
        this.after('READ', Orders, (results) => {
            const orders = Array.isArray(results) ? results : [results];
            for (const order of orders) {
                if (order.amount !== undefined && order.amount !== null) {
                    order.priority  = computePriority(order.amount);
                    order.riskScore = computeRiskScore(order.amount, order.status);
                }
            }
        });

        /**
         * ================================================================
         *  INTÉGRATION EXTERNE SIMULÉE — Statut de livraison
         * ================================================================
         *
         *  Cette function simule un appel à un service de suivi
         *  de livraison externe (transporteur, TMS, plateforme logistique).
         *
         *  Dans un projet réel, on ferait ici :
         *   - un appel HTTP vers une API REST tierce
         *   - ou un appel via SAP Integration Suite / Open Connectors
         *   - ou une lecture depuis un event mesh (SAP Event Mesh)
         *
         *  Les données retournées sont mockées pour la démonstration.
         */
        this.on('getDeliveryStatus', async (req) => {
            const { orderID } = req.data;

            // Simulation de données provenant d'un système externe
            const mockStatuses = [
                { status: 'Livré',    carrier: 'DHL Express',    trackingNo: 'DHL-2026-88421', estimatedDelivery: '2026-04-10', lastUpdate: '2026-04-10T14:30:00Z' },
                { status: 'En transit', carrier: 'DB Schenker',  trackingNo: 'DBS-2026-77532', estimatedDelivery: '2026-04-18', lastUpdate: '2026-04-15T09:15:00Z' },
                { status: 'En attente de collecte', carrier: 'Kuehne+Nagel', trackingNo: 'KN-2026-66123', estimatedDelivery: '2026-04-22', lastUpdate: '2026-04-14T11:00:00Z' },
                { status: 'Retard',   carrier: 'FedEx Freight',  trackingNo: 'FDX-2026-55987', estimatedDelivery: '2026-04-25', lastUpdate: '2026-04-13T16:45:00Z' },
            ];

            // Sélection pseudo-aléatoire basée sur l'ID pour être déterministe
            const index = orderID ? orderID.charCodeAt(0) % mockStatuses.length : 0;
            const delivery = mockStatuses[index];

            return {
                orderID,
                carrier:           delivery.carrier,
                trackingNo:        delivery.trackingNo,
                status:            delivery.status,
                estimatedDelivery: delivery.estimatedDelivery,
                lastUpdate:        delivery.lastUpdate,
            };
        });

        return super.init();
    }
};
