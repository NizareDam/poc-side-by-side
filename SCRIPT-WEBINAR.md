# SCRIPT WEBINAR — Order Enrichment Dashboard
## Extension Side-by-Side SAP BTP / S/4HANA

> **Durée estimée de la démo** : 15–20 minutes  
> **Public** : mixte (décideurs, fonctionnels, techniques)  
> **Ton** : professionnel, pédagogique, concret

---

## PARTIE 1 — Introduction et contexte (3 min)

### Slide d'accroche

*"Aujourd'hui, beaucoup d'entreprises se posent la même question : comment innover autour de mon ERP sans le fragiliser ?"*

*"SAP S/4HANA couvre déjà énormément de besoins de gestion — le suivi des commandes, la comptabilité, les achats, la logistique… Et c'est justement parce que ce standard est solide qu'il ne faut pas y toucher inutilement."*

*"Ce qu'on va vous montrer aujourd'hui, c'est comment enrichir intelligemment ce standard, depuis l'extérieur, grâce à SAP BTP. C'est ce qu'on appelle une extension side-by-side."*

### Poser les concepts clés

*"Avant de plonger dans la démo, trois concepts à retenir :"*

1. **Clean Core** — *"On ne modifie pas le cœur de S/4HANA. Aucune modification custom dans l'ERP. Le système standard reste propre, maintenable, et upgradable."*

2. **Side-by-Side** — *"L'extension vit à côté de l'ERP, sur SAP BTP. Elle consomme les données de S/4HANA via des APIs standard, elle ajoute de la valeur dessus, et elle expose le résultat dans une application dédiée."*

3. **Enrichissement, pas remplacement** — *"On ne recrée pas la gestion des commandes. On prend les données du standard, et on les enrichit avec une logique métier spécifique qui n'a pas sa place dans l'ERP."*

---

## PARTIE 2 — Présentation de l'architecture (2 min)

### Montrer le schéma d'architecture

*"Voici l'architecture de ce qu'on va voir. Trois couches bien distinctes :"*

**Couche 1 — SAP S/4HANA (en bas)**
*"C'est l'ERP. Il contient les commandes de vente — les Sales Orders. Dans cette démo, on simule ces données, mais dans un vrai projet, on se connecterait à l'API standard `API_SALES_ORDER_SRV` via une destination BTP."*

**Couche 2 — SAP BTP / CAP (au milieu)**
*"C'est le cerveau de l'extension. Un service développé avec SAP Cloud Application Programming Model — CAP — en Node.js. C'est ici que se passe l'enrichissement : la priorisation, le scoring de risque, l'intégration avec un système externe."*

**Couche 3 — Application SAPUI5 (en haut)**
*"C'est l'interface utilisateur. Une application Fiori freestyle, au design Horizon, qui offre une vue métier dédiée — un dashboard que vous ne trouverez pas dans le standard."*

*"Le point essentiel : chaque couche a son rôle, et elles sont complètement découplées. Si demain on change le transporteur, on ne touche ni à S/4HANA, ni au frontend. Si on veut ajouter un nouveau critère de priorisation, on modifie uniquement le service BTP."*

---

## PARTIE 3 — Démo live (10–12 min)

### Étape 1 — Le dashboard principal (3 min)

> **Action** : Ouvrir l'application dans le navigateur → `http://localhost:4004/order-enrichment/webapp/index.html`

*"Voici le Order Enrichment Dashboard. En un coup d'œil, on a une vue complète de nos commandes enrichies."*

#### Montrer les KPI en haut

*"Tout en haut, quatre indicateurs clés :"*
- **12 commandes** au total
- **4 en priorité HIGH** — ce sont celles qui dépassent 10 000 €
- **Le montant total** du portefeuille
- **Un score de risque moyen** calculé sur l'ensemble

*"Ces KPI n'existent nulle part dans S/4HANA. Ils sont calculés en temps réel par notre logique côté BTP."*

#### Montrer le tableau

*"Dans le tableau, on retrouve les données familières — numéro de commande, client, montant, statut — ce sont des données ERP classiques. Mais regardez les deux dernières colonnes : Priorité et Risque."*

*"La priorité, c'est un calcul métier spécifique à l'entreprise :"*
- **HIGH** (en rouge) : commande supérieure à 10 000 € → *par exemple Airbus Defence avec 87 500 €*
- **MEDIUM** (en orange) : entre 1 000 € et 10 000 € → *par exemple Siemens Énergie avec 3 200 €*
- **NORMAL** (en vert) : inférieure à 1 000 € → *par exemple L'Oréal Luxe avec 320 €*

*"Le score de risque combine le montant ET le statut de la commande. Une commande à montant élevé en statut 'En attente' sera plus risquée qu'une commande confirmée."*

> **Action** : Pointer la commande Nestlé Suisse (SO-10006) — 6 450 €, Annulée, risque élevé

*"Regardez Nestlé Suisse : montant moyen de 6 450 €, mais statut Annulée — le score de risque monte à 60. Le système détecte automatiquement que cette commande nécessite une attention particulière."*

#### Démontrer les filtres

> **Action** : Filtrer par priorité "Haute"

*"Si je suis un responsable supply chain et que je veux voir uniquement les commandes critiques, je filtre sur la priorité HIGH. Immédiatement, je n'ai plus que mes 4 commandes stratégiques."*

> **Action** : Remettre sur "Toutes", puis filtrer par statut "En attente"

*"Si je filtre par statut 'En attente', je vois les commandes bloquées — Siemens Énergie et Thales Défense. Ce sont celles sur lesquelles il faut agir."*

> **Action** : Utiliser la recherche pour taper "Airbus"

*"Je peux aussi chercher directement un client. Tout cela, c'est une expérience utilisateur pensée pour un rôle précis — ici, un gestionnaire de commandes — qui n'existe pas dans le standard SAP."*

> **Action** : Remettre les filtres à zéro

---

### Étape 2 — La fiche détail d'une commande (4 min)

> **Action** : Cliquer sur la commande Airbus Defence (SO-10003, 87 500 €)

*"Quand je clique sur une commande, j'arrive sur la fiche détaillée. Et c'est ici que la pédagogie de la démo est la plus claire, parce que la page est organisée en trois sections bien distinctes."*

#### Section 1 — Données ERP (S/4HANA)

*"La première section, avec le bandeau bleu 'Information', affiche les données standard. Numéro de commande SO-10003, client Airbus Defence, basé à Toulouse, catégorie Aéronautique, montant de 87 500 €, 2 unités, statut Confirmée."*

*"Toutes ces données, ce sont des données ERP classiques. Dans un vrai projet, elles viendraient de l'API `A_SalesOrder` de S/4HANA. On ne les a ni modifiées, ni dupliquées dans l'ERP — on les consomme en lecture."*

#### Section 2 — Enrichissement BTP

> **Action** : Scroller jusqu'à la section "Enrichissement BTP (Side-by-Side)"

*"Deuxième section — le bandeau orange 'Warning' indique clairement que ces données n'existent pas dans S/4HANA."*

*"La priorité de cette commande est HIGH, parce que 87 500 € dépasse le seuil de 10 000 €. Le score de risque est à 60 sur 100, avec la barre de progression visuelle."*

*"On voit aussi les règles appliquées : la composante montant pèse 60% du score, la composante statut 40%. Comme la commande est confirmée, il n'y a pas de malus sur le statut — le risque vient uniquement du montant élevé."*

*"Ce qui est important ici : cette logique de priorisation est propre à cette entreprise. Une autre entreprise pourrait avoir des seuils différents, intégrer le type de client, ou même utiliser un modèle de machine learning déployé sur SAP AI Core. Le cœur S/4HANA, lui, ne change pas."*

#### Section 3 — Intégration externe

> **Action** : Scroller jusqu'à la section "Suivi de livraison (Système externe)"

*"Troisième section — le bandeau vert indique une intégration avec un système externe. Ici, on simule un appel à un service de suivi de livraison — un transporteur."*

*"On obtient le nom du transporteur, le numéro de suivi, le statut de livraison, la date estimée. Dans un vrai projet, ça serait un appel REST vers l'API de DHL, FedEx, ou un TMS, potentiellement routé via SAP Integration Suite."*

> **Action** : Cliquer sur le bouton "Rafraîchir le statut de livraison"

*"Et si je clique sur Rafraîchir, le système interroge à nouveau le service externe pour obtenir le statut le plus récent."*

*"L'intérêt, c'est que cette intégration est totalement transparente pour l'ERP. S/4HANA n'a aucune connaissance de ce transporteur. L'orchestration se fait entièrement sur BTP."*

---

### Étape 3 — Sous le capot : le code (3 min)

> **Action** : Basculer sur VS Code

*"Maintenant, pour ceux qui veulent comprendre comment c'est construit, un rapide tour du code."*

#### Le modèle de données

> **Action** : Ouvrir `db/schema.cds`

*"Voici le modèle CDS. L'entité Orders contient les champs classiques d'une commande — numéro, client, montant, statut — ce sont les données ERP. Et en dessous, les deux champs d'enrichissement : priority et riskScore. Le commentaire dans le code est explicite : ces champs n'existent pas dans S/4HANA."*

#### La logique métier

> **Action** : Ouvrir `srv/order-enrichment-service.js`

*"C'est le fichier clé de l'extension. Trois blocs :"*

*"Premièrement, la fonction `computePriority` — trois lignes de code qui classifient chaque commande en HIGH, MEDIUM ou NORMAL selon le montant."*

*"Deuxièmement, `computeRiskScore` — un algorithme de scoring qui combine le montant (60 points max) et le statut (40 points max). Une commande annulée prend 40 points de malus, une commande en attente 25."*

*"Troisièmement, la function `getDeliveryStatus` — elle simule un appel à un transporteur externe et retourne un objet avec le carrier, le numéro de suivi, le statut."*

*"Et le handler `after READ` — c'est lui qui fait le lien. À chaque lecture de commande, il enrichit les données brutes avec la priorité et le score calculés. C'est ça, concrètement, le side-by-side : les données passent par une couche d'intelligence avant d'arriver au frontend."*

#### Les données mockées

> **Action** : Ouvrir `db/data/sap.btp.orders-Orders.csv`

*"Les données de démo : 12 commandes réalistes — Schneider, Airbus, Siemens, Renault, TotalEnergies… Des montants variés de 320 € à 87 500 €, différents statuts, différentes catégories produit. Dans un vrai projet, ce fichier CSV serait remplacé par un appel API à S/4HANA."*

---

## PARTIE 4 — Connexion avec la réalité (2 min)

*"Ce que vous venez de voir est un POC. Mais le passage en production est très concret :"*

1. **Données réelles** — *"On remplace le fichier CSV par une connexion à S/4HANA via une destination BTP. Le modèle CAP supporte nativement les remote services — c'est une configuration, pas un redéveloppement."*

2. **Logique métier évolutive** — *"Les règles de priorisation et de scoring sont dans du code Node.js côté BTP. On peut les faire évoluer — ajouter des critères, brancher un modèle ML, ajuster les seuils — sans jamais toucher à S/4HANA."*

3. **Intégration réelle** — *"Le mock transporteur serait remplacé par un appel à l'API de votre prestataire logistique, idéalement via SAP Integration Suite pour centraliser le monitoring et la gestion des erreurs."*

4. **Déploiement** — *"L'application se déploie sur SAP BTP Cloud Foundry ou Kyma. Le frontend peut être exposé via SAP Launchpad Service pour s'intégrer nativement dans le Fiori Launchpad de l'entreprise."*

---

## PARTIE 5 — Messages clés à faire passer (1 min)

*"Pour résumer en trois phrases ce qu'on vient de voir :"*

1. **On ne remplace pas le standard, on l'enrichit.** *"S/4HANA reste le système de référence pour les commandes. L'extension se nourrit de ses données sans les altérer."*

2. **L'innovation se fait à côté, pas dedans.** *"Priorisation, scoring, intégration externe — tout cela vit sur BTP. Le jour où SAP met à jour S/4HANA, l'extension continue de fonctionner."*

3. **C'est concret et réalisable.** *"Ce que vous venez de voir tourne avec SAP CAP, SAPUI5, et des technologies standard SAP. Pas de magie, pas de prototype fragile — c'est la stack recommandée par SAP pour les extensions."*

---

## AIDE-MÉMOIRE — Commandes les plus parlantes pour la démo

| Commande | Client | Montant | Statut | Priorité | Risque | Intérêt pédagogique |
|---|---|---|---|---|---|---|
| SO-10003 | Airbus Defence | 87 500 € | Confirmée | HIGH | 60 | Montant très élevé, risque modéré car confirmée |
| SO-10006 | Nestlé Suisse | 6 450 € | Annulée | MEDIUM | 60 | Montant moyen mais risque élevé (annulation) |
| SO-10009 | Thales Défense | 42 000 € | En attente | HIGH | 65 | Gros montant + statut bloquant = risque max |
| SO-10012 | L'Oréal Luxe | 320 € | Confirmée | NORMAL | 10 | Petite commande, aucun risque |
| SO-10002 | BASF Chimie | 480 € | En cours | NORMAL | 20 | Commande standard, enrichissement minimal |

---

## CHECKLIST AVANT LE WEBINAR

- [ ] `npm install` effectué
- [ ] `cds watch` lancé et serveur actif sur le port 4004
- [ ] Application SAPUI5 accessible dans le navigateur
- [ ] Filtres testés (statut + priorité)
- [ ] Navigation vers le détail vérifiée
- [ ] Bouton "Rafraîchir livraison" testé
- [ ] VS Code ouvert avec les 3 fichiers clés prêts en onglets :
  - `db/schema.cds`
  - `srv/order-enrichment-service.js`
  - `db/data/sap.btp.orders-Orders.csv`
- [ ] Slides d'architecture prêtes (si applicable)
