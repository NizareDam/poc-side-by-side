# SCRIPT DÉMO — Order Enrichment Dashboard
## Texte oral uniquement — prêt à lire

> **Débit cible** : ~150 mots/minute (moyenne française en présentation)  
> **Total** : ~1 800 mots → **~12 minutes de démo**  
> Les indications entre crochets [...] sont des actions silencieuses à faire pendant que vous parlez.

---

### OUVERTURE — 1 min 30 (~225 mots)

Je vais maintenant vous montrer concrètement ce dont on vient de parler. On a développé un petit prototype, un POC, qui illustre exactement le principe d'une extension side-by-side.

Le scénario est simple. Imaginons qu'on est une entreprise industrielle. On a SAP S/4HANA qui gère nos commandes de vente. Le standard fonctionne bien. On sait créer des commandes, les valider, les facturer. Ça, c'est couvert.

Mais notre directeur supply chain nous dit : « Moi, j'ai besoin de savoir en un coup d'œil quelles commandes sont critiques. J'ai besoin d'un scoring de risque. Et j'ai besoin du statut de livraison du transporteur, directement dans la même vue. »

Est-ce qu'on modifie S/4HANA pour ça ? Non. On va construire une application à côté, sur SAP BTP, qui consomme les données de l'ERP et qui les enrichit. C'est exactement ce que vous allez voir maintenant.

L'application s'appelle « Order Enrichment Dashboard ». Elle est construite avec la stack standard SAP : un backend en SAP CAP, Node.js, qui expose un service OData V4, et un frontend en SAPUI5 avec le thème Fiori Horizon.

Les données de commandes que vous allez voir simulent ce qui viendrait de S/4HANA. En production, on remplacerait simplement le mock par un appel à l'API Sales Order.

[Ouvrir l'application dans le navigateur]

---

### LE DASHBOARD — 3 min 30 (~525 mots)

Voilà le dashboard. Première chose qu'on voit : quatre indicateurs en haut de page. Douze commandes au total. Quatre en priorité haute. Le montant total du portefeuille. Et un score de risque moyen sur cent.

Ces quatre indicateurs n'existent nulle part dans S/4HANA. Ils sont calculés en temps réel par notre service sur BTP. C'est déjà de l'enrichissement.

En dessous, le tableau de commandes. On retrouve les colonnes classiques : numéro de commande, client, ville, montant, statut. Ça, ce sont des données ERP. Rien de nouveau.

Mais regardez les deux colonnes à droite : Priorité et Risque. C'est là que l'extension intervient.

La priorité, c'est un calcul métier propre à cette entreprise. La règle est simple : au-dessus de dix mille euros, c'est HIGH, en rouge. Entre mille et dix mille, c'est MEDIUM, en orange. En dessous de mille euros, c'est NORMAL, en vert.

[Pointer Airbus Defence dans le tableau]

Par exemple, Airbus Defence : quatre-vingt-sept mille cinq cents euros. C'est clairement HIGH. Le badge rouge saute aux yeux immédiatement.

[Pointer L'Oréal Luxe]

À l'inverse, L'Oréal Luxe : trois cent vingt euros. Priorité NORMAL, en vert. Score de risque à dix sur cent. Cette commande ne pose aucun problème.

[Pointer Nestlé Suisse]

Maintenant, regardez Nestlé Suisse. Six mille quatre cent cinquante euros, donc priorité MEDIUM. Mais le statut est « Annulée ». Et son score de risque monte à soixante. Pourquoi ? Parce que notre algorithme de scoring prend en compte deux facteurs : le montant, qui pèse soixante pour cent, et le statut, qui pèse quarante pour cent. Une annulation, c'est un signal fort.

C'est exactement le type de logique qu'une entreprise veut implémenter sans toucher au cœur de l'ERP. Chaque entreprise a ses propres règles. Ici, on a choisi des seuils simples. En vrai, on pourrait intégrer le type de client, l'historique de commandes, ou même un modèle de machine learning sur SAP AI Core. Le principe reste le même : la donnée vient de S/4HANA, l'intelligence est sur BTP.

Maintenant, les filtres.

[Sélectionner le filtre Priorité → "Haute"]

Si je filtre sur la priorité haute, je ne vois plus que mes quatre commandes critiques. Schneider Électrique, Airbus, Bosch, Thales. Ce sont celles qui nécessitent l'attention du management.

[Remettre le filtre sur "Toutes"]

[Sélectionner le filtre Statut → "En attente"]

Si je filtre par statut « En attente », j'identifie immédiatement les commandes bloquées. Siemens Énergie et Thales Défense. Le responsable peut agir directement.

[Remettre le filtre sur "Tous"]

[Taper "Airbus" dans la barre de recherche]

Et si je cherche un client précis, je tape son nom. Airbus. Résultat immédiat.

[Effacer la recherche]

Tout ça, c'est une expérience utilisateur pensée pour un rôle métier précis. Un gestionnaire de commandes, un responsable supply chain. Cette vue n'existe pas dans le standard S/4HANA. On l'a créée à côté, sur BTP, pour un besoin spécifique.

---

### LE DÉTAIL D'UNE COMMANDE — 3 min 30 (~525 mots)

Maintenant, si je clique sur une commande pour voir le détail.

[Cliquer sur Airbus Defence — SO-10003]

On arrive sur une fiche structurée en Object Page, le format standard Fiori pour les fiches détaillées. Et cette page est organisée volontairement en trois sections bien distinctes, pour que le message soit clair.

La première section s'appelle « Données ERP ». Le bandeau bleu le dit : « Ces données représentent les informations standard provenant de SAP S/4HANA. » On y trouve le numéro de commande SO-10003, le client Airbus Defence à Toulouse, catégorie Aéronautique, montant de quatre-vingt-sept mille cinq cents euros, quantité de deux, statut Confirmée, date de création février deux mille vingt-six. Tout cela, c'est du pur standard ERP. En production, ça viendrait directement de l'API Sales Order de S/4HANA.

[Scroller vers la deuxième section]

La deuxième section, c'est « Enrichissement BTP ». Le bandeau orange le dit explicitement : « Ces données sont calculées par la logique métier déployée sur SAP BTP. Elles n'existent pas dans S/4HANA. » C'est le cœur du side-by-side.

La priorité est HIGH. Le score de risque est à soixante sur cent, avec la barre de progression visuelle. On voit même les règles appliquées : HIGH au-dessus de dix mille euros, MEDIUM au-dessus de mille, NORMAL en dessous. Et la composition du score : montant soixante pour cent, statut quarante pour cent.

Ce qui est intéressant ici, c'est que cette commande Airbus est confirmée. Donc elle ne prend aucun malus sur le statut. Ses soixante points de risque viennent uniquement du montant très élevé. Si cette même commande passait en statut « En attente », le score monterait à quatre-vingt-cinq. C'est la combinaison des deux facteurs qui donne la vraie image du risque.

[Scroller vers la troisième section]

Troisième section : « Suivi de livraison, système externe ». Le bandeau vert précise que ces informations viennent d'un service tiers. On voit le nom du transporteur, le numéro de suivi, le statut de livraison, la date estimée.

Dans ce POC, c'est simulé. Mais en production, ça serait un appel REST vers l'API de DHL, DB Schenker, FedEx, ou n'importe quel prestataire logistique. Cette intégration pourrait passer par SAP Integration Suite pour centraliser le monitoring.

[Cliquer sur le bouton "Rafraîchir le statut de livraison"]

Je peux rafraîchir le statut à la demande. Le système interroge le service externe et met à jour les informations.

Le point essentiel : S/4HANA n'a aucune connaissance de ce transporteur. L'ERP gère la commande, point. L'intégration avec le monde extérieur se fait côté BTP. C'est exactement le découplage qu'on recherche.

[Cliquer sur la flèche retour pour revenir au dashboard]

---

### SOUS LE CAPOT — 2 min (~300 mots)

Pour les plus curieux, regardons rapidement le code.

[Basculer sur VS Code, ouvrir db/schema.cds]

Voici le modèle de données. On a une entité Orders avec les champs classiques : numéro de commande, client, montant, statut. Et en dessous, deux champs supplémentaires : priority et riskScore. Le commentaire dans le code est clair : ces champs n'existent pas dans S/4HANA, ils sont ajoutés par l'extension.

[Ouvrir srv/order-enrichment-service.js]

Et voici la logique métier. Trois blocs.

Le premier calcule la priorité : trois lignes de code. Au-dessus de dix mille, HIGH. Au-dessus de mille, MEDIUM. Sinon, NORMAL.

Le deuxième calcule le score de risque en combinant le montant et le statut. Une commande annulée prend quarante points de malus. Une commande en attente, vingt-cinq.

Et le troisième bloc simule l'appel au transporteur externe. En production, ces cinq lignes deviendraient un appel HTTP vers une API réelle.

Le handler « after READ » fait le lien : à chaque fois que le frontend demande des commandes, les données passent par cette couche d'enrichissement avant d'arriver à l'écran. C'est ça le side-by-side : les données ERP brutes traversent une couche d'intelligence sur BTP.

[Ouvrir db/data/sap.btp.orders-Orders.csv]

Et les données : douze commandes réalistes dans un fichier CSV. Schneider, Airbus, Siemens, Renault, TotalEnergies, Thales. En production, ce fichier serait remplacé par une connexion API vers S/4HANA, via une destination BTP. C'est de la configuration, pas du redéveloppement.

---

### CONCLUSION — 1 min 30 (~225 mots)

Voilà ce qu'on vient de voir. Une application concrète, qui tourne, et qui illustre trois choses.

Premièrement : on ne remplace pas le standard SAP. Les commandes restent dans S/4HANA. On les consomme en lecture via une API. Le cœur ERP reste propre, maintenable, et prêt pour les mises à jour. C'est ça, le Clean Core.

Deuxièmement : l'intelligence se construit à côté. La priorisation, le scoring de risque, l'intégration transporteur, tout ça vit sur BTP. On peut faire évoluer ces règles, les changer, les enrichir, sans jamais ouvrir S/4HANA.

Troisièmement : l'expérience utilisateur est pensée pour le métier. Le gestionnaire de commandes a sa propre vue, avec ses indicateurs, ses filtres, son scoring. Il n'a pas besoin de naviguer dans cinq transactions SAP pour trouver l'information. Tout est dans un seul dashboard.

Et ce qu'on a montré ici en douze minutes, c'est construisable en quelques jours avec la stack SAP standard. CAP, SAPUI5, BTP. Pas de technologie exotique, pas de framework inconnu. Ce sont les outils recommandés par SAP pour construire des extensions propres, maintenables et évolutives.

Si ça vous intéresse, on peut en discuter après la session pour voir comment ce type d'approche s'appliquerait à votre contexte.

---

> **Total script** : ~1 800 mots → **~12 minutes** à 150 mots/minute
