/**
 * ============================================================================
 *  COUCHE ERP SIMULÉE — Modèle de données
 * ============================================================================
 *
 *  Ces entités représentent les données qui, dans un projet réel,
 *  proviendraient de SAP S/4HANA via des APIs standard (ex : Sales Order API).
 *
 *  Ici, elles sont mockées localement pour la démonstration.
 *  Dans un projet réel, on utiliserait un "remote service" CAP
 *  connecté à l'API Business Hub de S/4HANA.
 *
 * ============================================================================
 */
namespace sap.btp.orders;

using { cuid, managed } from '@sap/cds/common';

/**
 * Entité principale — Commandes (simulant les Sales Orders de S/4HANA)
 *
 * Dans un vrai projet side-by-side, cette entité serait remplacée par
 * une projection sur un "remote service" S/4HANA (ex : API_SALES_ORDER_SRV).
 */
entity Orders : cuid, managed {
    orderNumber   : String(10)   @title: 'N° Commande';
    customerName  : String(100)  @title: 'Client';
    customerCity  : String(60)   @title: 'Ville';
    amount        : Decimal(15,2)@title: 'Montant (€)';
    currency      : String(3)    @title: 'Devise'       default 'EUR';
    status        : String(20)   @title: 'Statut';
    productCategory : String(40) @title: 'Catégorie produit';
    quantity      : Integer      @title: 'Quantité';

    /**
     * ---- Champs d'enrichissement side-by-side (calculés côté BTP) ----
     * Ces champs n'existent PAS dans S/4HANA, ils sont ajoutés
     * par la logique métier de l'extension sur SAP BTP.
     */
    priority      : String(10)   @title: 'Priorité'     default 'NORMAL';
    riskScore     : Integer      @title: 'Score de risque';
}
