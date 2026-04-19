# Order Enrichment Dashboard

**POC Side-by-Side — SAP BTP / SAP S/4HANA**

> Démonstration d'une extension side-by-side sur SAP BTP, illustrant comment enrichir le standard SAP S/4HANA sans modifier le cœur de l'ERP (Clean Core).

---

## Scénario métier

Le standard SAP S/4HANA gère déjà les commandes de vente (Sales Orders). Cette application ne remplace **aucune fonctionnalité standard**.

Elle montre comment **enrichir intelligemment** le processus de suivi de commandes en ajoutant, côté SAP BTP :

| Enrichissement | Description | Source |
|---|---|---|
| **Priorisation métier** | Classification automatique (HIGH / MEDIUM / NORMAL) selon le montant | Logique BTP |
| **Score de risque** | Scoring 0–100 basé sur le montant et le statut | Logique BTP |
| **Suivi de livraison** | Statut en temps réel provenant d'un transporteur externe | API externe (simulée) |
| **Dashboard dédié** | Vue métier simplifiée avec KPI et filtres spécifiques | UX BTP |

**Message clé** : on ne remplace pas le standard SAP, on **l'enrichit**.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      APPLICATION SAPUI5                        │
│               (Order Enrichment Dashboard)                     │
│          Fiori Horizon • Responsive • Freestyle                │
└──────────────────────────┬─────────────────────────────────────┘
                           │  OData V4
┌──────────────────────────▼─────────────────────────────────────┐
│                     SERVICE CAP (Node.js)                      │
│                                                                │
│  ┌──────────────────┐  ┌─────────────────┐  ┌───────────────┐ │
│  │  Données ERP     │  │  Enrichissement │  │  Intégration  │ │
│  │  (mock S/4HANA)  │  │  Side-by-Side   │  │  Externe      │ │
│  │                  │  │                 │  │  (simulée)    │ │
│  │  • Commandes     │  │  • Priorité     │  │  • Livraison  │ │
│  │  • Clients       │  │  • Risk Score   │  │  • Tracking   │ │
│  │  • Montants      │  │  • KPI          │  │  • Statut     │ │
│  └──────────────────┘  └─────────────────┘  └───────────────┘ │
│                                                                │
│              SAP BTP — Cloud Application Programming           │
└────────────────────────────────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │     SAP S/4HANA         │
              │   (mockée dans ce POC)  │
              │                         │
              │  API_SALES_ORDER_SRV    │
              │  (remplacerait le CSV)  │
              └─────────────────────────┘
```

### Séparation des couches

| Couche | Rôle | Fichiers |
|---|---|---|
| **Données ERP** (mock) | Simule les données de commandes S/4HANA | `db/schema.cds`, `db/data/*.csv` |
| **Service BTP** | Expose l'API OData + logique métier | `srv/order-enrichment-service.cds`, `.js` |
| **Frontend UX** | Application SAPUI5 Fiori | `app/order-enrichment/webapp/` |

---

## Stack technique

- **Backend** : SAP CAP (Node.js) — CDS + Handlers
- **Base de données** : SQLite (in-memory, via `@cap-js/sqlite`)
- **Protocole** : OData V4
- **Frontend** : SAPUI5 (Fiori freestyle, thème Horizon)
- **Données** : Mockées en CSV

---

## Lancer le projet

### Prérequis

- Node.js ≥ 18
- npm
- SAP CDS CLI (`npm i -g @sap/cds-dk`)

### Installation

```bash
npm install
```

### Démarrage

```bash
cds watch
```

L'application sera accessible sur :
- **Service OData** : http://localhost:4004/api
- **Application SAPUI5** : http://localhost:4004/order-enrichment/webapp/index.html

---

## Structure du projet

```
poc-side-by-side/
├── db/
│   ├── schema.cds                          # Modèle de données (entité Orders)
│   └── data/
│       └── sap.btp.orders-Orders.csv       # Données mockées (simulant S/4HANA)
├── srv/
│   ├── order-enrichment-service.cds        # Définition du service OData
│   └── order-enrichment-service.js         # Handlers CAP (logique side-by-side)
├── app/
│   └── order-enrichment/
│       └── webapp/
│           ├── index.html                  # Point d'entrée
│           ├── manifest.json               # Configuration SAPUI5
│           ├── Component.js                # Composant UI5
│           ├── view/
│           │   ├── App.view.xml            # Vue racine
│           │   ├── OrderList.view.xml      # Page liste (dashboard)
│           │   └── OrderDetail.view.xml    # Page détail (Object Page)
│           └── controller/
│               ├── OrderList.controller.js # Contrôleur liste
│               └── OrderDetail.controller.js # Contrôleur détail
├── package.json
└── readme.md
```

---

## Connexion à un vrai SAP S/4HANA

Dans un projet réel, voici les modifications à apporter :

### 1. Remplacer le mock par un Remote Service

```cds
// srv/external/API_SALES_ORDER_SRV.cds (importé depuis API Hub)
using { API_SALES_ORDER_SRV } from './external/API_SALES_ORDER_SRV';

service OrderEnrichmentService {
    entity Orders as projection on API_SALES_ORDER_SRV.A_SalesOrder {
        SalesOrder       as orderNumber,
        SoldToParty      as customerName,
        TotalNetAmount   as amount,
        // ... mapping des champs
    };
}
```

### 2. Configurer la Destination BTP

```json
// package.json
{
  "cds": {
    "requires": {
      "API_SALES_ORDER_SRV": {
        "kind": "odata-v2",
        "model": "srv/external/API_SALES_ORDER_SRV",
        "credentials": {
          "destination": "S4HANA_DEST",
          "path": "/sap/opu/odata/sap/API_SALES_ORDER_SRV"
        }
      }
    }
  }
}
```

### 3. Créer la Destination sur SAP BTP

- Dans le cockpit BTP → Connectivity → Destinations
- Configurer l'URL du système S/4HANA
- Authentification : OAuth2SAMLBearerAssertion ou BasicAuthentication
- Principal Propagation si nécessaire

### 4. Intégration externe réelle

Remplacer le mock `getDeliveryStatus` par un appel HTTP vers l'API du transporteur, idéalement via **SAP Integration Suite** pour bénéficier du monitoring et de la transformation de données.

---

## Concepts illustrés dans le webinar

| Concept | Où le voir dans le POC |
|---|---|
| **Clean Core** | Les données S/4HANA ne sont pas modifiées — elles sont consommées en lecture seule |
| **Extension Side-by-Side** | La logique métier (priorité, risque) est déployée séparément sur SAP BTP |
| **Consommation d'APIs** | Le service CAP consomme les données comme il consommerait une API S/4HANA |
| **Innovation sans impact** | Le scoring et la priorisation sont ajoutés sans toucher au cœur ERP |
| **Intégration externe** | La function `getDeliveryStatus` simule un système tiers |
| **UX moderne** | L'application SAPUI5 offre une vue métier dédiée, inexistante dans le standard |

---

## Licence

POC à usage de démonstration interne uniquement.
# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Learn More

Learn more at <https://cap.cloud.sap>.
