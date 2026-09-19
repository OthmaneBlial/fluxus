# Roadmap de Fluxus

> Audit initial du dépôt au 19 septembre 2026, commit `5ab9472`. Ce document est un plan, pas une déclaration de fonctionnalités ou de publication. Le tableau de diagnostic fige l'audit initial ; le suivi ci-dessous évolue avec les preuves. Les constats initiaux portent sur les fichiers suivis et sur des commandes exécutées dans une **copie temporaire du commit**. Les résultats de commandes peuvent varier selon l'environnement : après installation dans le checkout courant, `yarn type-check` a réussi et listé les fichiers `src/` et `test/`, tandis que `yarn lint` a échoué. L'état des GitHub Releases et des utilisateurs externes n'a pas été vérifié.

## Diagnostic et cap produit

Fluxus est aujourd'hui un petit magasin d'état TypeScript sans dépendance d'exécution déclarée. L'API exporte `createStore`, `createAction`, `createReducer`, `Store`, `applyMiddleware`, ainsi que trois familles d'utilitaires (`memoize`, mises à jour de tableaux/objets, `lazy`/`measureTime`). Quatre pages HTML illustrent compteur, tâches, panier et « authentification ». La valeur potentielle est un **état prévisible et simple pour de petites applications JavaScript/TypeScript**, avec une intégration directe sans framework. C'est une hypothèse de positionnement à valider, pas une supériorité démontrée face à Redux ou à d'autres bibliothèques.

Le README et `Redux vs Fluxus.md` revendiquent de meilleures performances, moins de mémoire, une forte inférence TypeScript et des avantages face à Redux. Le dépôt ne contient ni benchmark reproductible ni comparaison de versions, ni test consommateur du paquet. Le texte comparatif affirme que `createAction` génère un type unique alors que le code reprend la chaîne fournie ; il décrit le middleware comme un simple emplacement futur alors qu'une implémentation existe. Le produit doit d'abord tenir un contrat vérifiable, puis choisir une différence utile à démontrer. Une liste de fonctions supplémentaires ne suffira pas à elle seule à favoriser l'adoption ou les stars.

### État vérifié

| Sujet | Preuve dans ce dépôt ou dans la copie du commit | Conséquence |
| --- | --- | --- |
| Tests | `yarn test` : 6 fichiers, 15 tests réussis. Aucun test de middleware, de paquet installé, de navigateur ni de types publics. | Base utile mais couverture des risques majeurs insuffisante. |
| TypeScript | `yarn type-check` : échec `TS18003`, aucun fichier d'entrée trouvé ; `tsconfig.json` utilise `include: ["."]`. | La promesse de sûreté des types n'est pas validée. |
| Lint | `yarn lint` : échec ; ESLint 9 ne charge pas `.eslintrc.js`. | La vérification de style est inopérante. |
| Build | `yarn build` produit CJS, ESM et `.d.ts` et sort avec code 0, **tout en affichant `TS18003` pendant la génération de types**. | Le code de succès ne constitue pas un feu vert de release. Aucun `dist/` n'est suivi. |
| Contrat des actions | `createAction('PING')()` possède `payload: undefined`. `toEqual` dans le test courant accepte néanmoins l'objet attendu sans cette propriété. | Test vert trompeur pour le contrat exact. |
| Réducteur | `createReducer` lit directement `reducerMap[action.type]` ; une action de type `toString` appelle la méthode héritée et renvoie une chaîne à la place de l'état (reproduit sur le build). | Défaut de correction et de robustesse des actions externes. |
| Immutabilité et mémoire | `updateObject({a:1}, {b:2})` renvoie `{a:1}` dans le build ; `memoize` conserve sans limite tous les arguments, et le store conserve les sélecteurs. | Les propriétés ajoutées se perdent ; la promesse de mémoire réduite n'est pas étayée. |
| Confidentialité | `Store.dispatch` journalise l'action et l'état avant/après ; `examples/auth.html` stocke les mots de passe en clair dans cet état. | Des secrets de démonstration arrivent dans la console ; l'exemple peut être pris à tort pour une solution d'authentification. |
| Démo navigateur | Après build et serveur HTTP local, Todo s'affiche et l'ajout fonctionne. Une tâche saisie comme `<b>Audit</b>` est rendue comme balise HTML via `innerHTML`. Le CDN Tailwind émet un avertissement de production. | Injection HTML dans l'exemple et démo non prête à publier. |
| Paquet | `npm pack --dry-run --json` dans la copie bâtie liste 37 entrées, dont `src/`, `test/`, HTML et configs. `package.json` n'a ni `exports`, ni `files`, ni script de vérification avant publication. | Surface et chemins de distribution à maîtriser ; installation npm du nom `fluxus` non vérifiée. |
| Présentation et livraison | Pas de capture, GIF, vidéo, guide de démarrage reproductible, workflow `.github/`, changelog, fichier de contribution/sécurité, tags locaux ou binaire suivi. Remote `origin` configuré ; aucune release distante examinée. | Un visiteur ne peut ni voir une preuve convaincante ni vérifier une livraison automatisée. |

**Ordre impératif :** P0 = contrat, sécurité et chaîne de validation ; P1 = expérience, preuve et publication ; P2 = apprentissage d'adoption. Une tâche ne devient « faite » qu'avec les critères et preuves indiqués. Les vérifications locales, la publication npm/GitHub et l'usage par d'autres personnes restent des états distincts. Les dates et versions concurrentes devront être revérifiées lors de leur étude ; le présent audit ne tire aucune conclusion sur leur état actuel.

### Suivi de l'exécution

- [ ] 0.1 Public, scénario et périmètre — documentés dans `docs/PRODUCT_SCOPE.md` ; lecture indépendante encore à obtenir.
- [x] 0.2 Comparaison loyale — `docs/COMPARISON.md`, versions du registre consultées le 19 septembre 2026, sources officielles et extrait Fluxus exécuté.
- [x] 1.1 Contrat actions/réducteurs — forme exacte, clés héritées et états `undefined` couverts ; 18 tests, type-check et build réussis localement.
- [x] 1.2 Dispatchs, abonnements et middlewares — contrat unique, ordre/erreurs/réentrance/notifications testés ; aucun journal d'état par défaut.
- [x] 1.3 Helpers et mémoire — clés ajoutées, symboles et tableaux creux testés ; cache à une entrée, sélecteurs faibles et profil mémoire local documentés.
- [x] 1.4 Exemples sûrs — texte DOM, session sans mot de passe, styles locaux et contrôles navigateur/390 px consignés dans `docs/EXAMPLE_QA.md`.
- [x] 2.1 TypeScript, lint et build — installation gelée sans `dist/`, lint, type-check, 36 tests et build réussis ; une erreur de type injectée dans une copie fait échouer `yarn build` (`docs/VALIDATION.md`).
- [x] 2.2 Types publics — définitions unifiées, union d'actions typée, erreurs de compilation positives/négatives dans `test/types/public-contract.ts`, déclarations CJS/ESM comparées et contrat documenté dans `docs/TYPES.md`.
- [x] 2.3 Paquet consommable — nom préfixé, exports et contenu npm réduits à 9 fichiers ; tarball installé dans un projet vierge et testé en ESM, CJS, TypeScript et bundler (`docs/PACKAGING.md`).
- [x] 2.4 Tests des frontières et du paquet — 40 tests sur comportements et erreurs, contrôle type positif/négatif, sous-chemin npm privé rejeté et `yarn verify` réussi après installation gelée en copie séparée (`docs/VALIDATION.md`).
- [x] 2.5 Benchmarks — harnais reproductible, trois exécutions brutes, tailles bundle, profil mémoire limité et compromis consignés dans `docs/BENCHMARKS.md` ; aucune supériorité générale revendiquée.
- [x] 3.1 Démo principale — workbench réel avec tâches, filtres, compteurs dérivés, observateur détachable et reset ; parcours navigateur/console/rechargement consignés dans `docs/DEMO.md`.
- [x] 3.2 Rendu, accessibilité et mobile — vues desktop/390/320 px inspectées, parcours clavier et états vide/erreur vérifiés, audit DOM/contraste local et corrections consignés dans `docs/ACCESSIBILITY_QA.md`.
- [x] 3.3 Décision sur les intégrations — recette vanilla et désabonnement documentés, React/persistance/DevTools reportés avec critères de réexamen dans `docs/INTEGRATIONS.md` ; aucune dépendance framework dans le paquet.
- [x] 4.1 README et guides — README et guides testés depuis le tarball sous Node 22/24, 48 liens locaux contrôlés et rendu GitHub du commit `8614da2` vérifié avec ouverture de `docs/API.md`.
- [x] 4.2 Preuves visuelles — captures réelles initiale/après actions/mobile et couverture issue de la capture, avec dimensions, hash et source dans `docs/assets/README.md` ; images chargées dans le README et le guide GitHub publics. Aucune démo hébergée n'est annoncée.
- [x] 4.3 Contribution et confiance — guides, politique de compatibilité, templates et canal GitHub de signalement privé publiés ; liens/YAML contrôlés, sélecteur d'issues et formulaire de bug vérifiés sans créer d'issue.
- [x] 5.1 CI — `yarn verify` réussi sur GitHub Actions Node 22/24 et Ubuntu 24.04 pour `main`, parcours PR réel observé, badge public chargé ; Dependabot hebdomadaire configuré, alertes activées et zéro alerte ouverte après mise à jour de la chaîne de build.
- [ ] 5.2 Artefacts et notes de version — `CHANGELOG.md`, notes, procédure et `release:check` présents ; tarball local de 11 695 octets et SHA-256 vérifiés, installation isolée réussie. Le hash de l'artefact **joint** reste à contrôler lors de 5.3.
- [ ] 5.3 Publication et vérification externes
- [ ] 6.1 Usages indépendants
- [ ] 6.2 Présentation et découverte — description/topics GitHub corrigés, aperçu social authentique chargé et introduction préparée dans `docs/LAUNCH_COPY.md` ; lien de démo publique et partage attendent la release vérifiée.
- [ ] 7.1 Capture et montage vidéo
- [ ] 7.2 Vérification du média livré

**Nouveau fait externe :** le registre npm répond `fluxus@0.0.8` pour un dépôt `yamiteru/fluxus`, étranger à ce checkout. Le nom non préfixé `fluxus` n'est donc pas une installation de ce projet ; sélectionner un nom contrôlé avant toute publication.

## Phase 0 — Choisir une promesse mesurable (P0)

### 0.1 Définir le public, le cas d'usage et le périmètre de la première release

- **Objectif :** donner une raison concrète d'essayer Fluxus, sans promesse générale de « meilleure gestion d'état ».
- **Changements :** décrire un utilisateur cible (par exemple une petite interface JavaScript/TypeScript sans framework), son problème, la tâche réalisable en dix minutes, les limites assumées et les fonctions indispensables. Décider explicitement si `lazy`, `measureTime` et les utilitaires d'immuabilité appartiennent au noyau public ou doivent être documentés comme helpers indépendants. Préciser ce que Fluxus ne garantit pas (persistance, authentification, synchronisation distante, intégration React native) tant que ces capacités n'existent pas.
- **Zones :** `README.md`, nouveau `docs/PRODUCT_SCOPE.md`, `src/index.ts`, `package.json`.
- **Acceptation :** proposition de valeur en deux phrases ; un scénario complet et une API minimale listés ; chaque promesse du README reliée à une preuve future ou retirée ; limites visibles avant l'installation.
- **Validation :** lecture croisée du scénario avec les exports réels ; un développeur inconnu du dépôt peut expliquer à qui sert Fluxus et quand ne pas le choisir.
- **Dépendances / risques :** précède les décisions d'API, de démo et de marketing ; risque de garder un positionnement trop large.

### 0.2 Refaire le dossier de comparaison sans extrapoler

- **Objectif :** remplacer l'argumentaire actuel par une comparaison loyale, utile à la décision.
- **Changements :** inventorier, au moment de l'exécution, les versions et documentations officielles des solutions retenues (au minimum Redux Toolkit et une bibliothèque de store léger pertinente). Comparer les mêmes tâches : créer un store, modifier un état, sélectionner un sous-état, intégrer une vue, installer, tester et inspecter la taille livrée. Corriger ou retirer les phrases non sourcées de `Redux vs Fluxus.md` et du README ; conserver les compromis où Fluxus est moins adapté. Ne publier aucun chiffre de vitesse avant la phase 2.
- **Zones :** `Redux vs Fluxus.md` à réécrire ou remplacer par `docs/COMPARISON.md`, `README.md`.
- **Acceptation :** versions, liens vers sources primaires, date, extraits de code équivalents et limites pour chaque comparaison ; aucune assertion de supériorité sans mesure.
- **Validation :** exécuter tous les extraits Fluxus ; relire les affirmations contre le code et les sources officielles choisies.
- **Dépendances / risques :** dépend de 0.1 ; comparaison périssable et risque de confondre Redux classique avec ses outils actuels.

## Phase 1 — Rendre le noyau correct et sûr (P0, bloquante)

### 1.1 Fixer le contrat des actions et des réducteurs

- **Objectif :** obtenir des actions prévisibles et empêcher qu'un nom d'action hérité change le type de l'état.
- **Changements :** choisir et documenter la présence du champ `payload` pour les actions sans données ; faire correspondre implémentation, types et tests. Dans `createReducer`, ne résoudre que les clés propres de la table ; traiter les noms `toString`, `constructor`, `__proto__` et les actions inconnues sans appeler de propriété héritée. Définir la réaction aux actions mal formées et à un réducteur qui renvoie `undefined`.
- **Zones :** `src/core/action.ts`, `src/core/reducer.ts`, `src/types/index.ts`, `test/core/action.test.ts`, `test/core/reducer.test.ts`.
- **Acceptation :** contrat écrit ; action sans données conforme à une assertion qui vérifie aussi les clés propres ; types réservés ou inconnus conservent un état valide ; aucun retour de chaîne ou de fonction hérité.
- **Validation :** tests de régression exacts (`Object.hasOwn`, `Object.keys`), tests des clés spéciales et du résultat `undefined`, `yarn test`, contrôle de types de la phase 2.
- **Dépendances / risques :** après 0.1 ; peut modifier la forme sérialisée des actions existantes, donc décision de compatibilité et note de changement requises.

### 1.2 Stabiliser les dispatchs, abonnements et middlewares

- **Objectif :** faire du store un contrat fiable dans les cas ordinaires et difficiles.
- **Changements :** retirer les `console.log` du chemin de dispatch ; unifier l'API middleware exposée dans `src/core/middleware.ts` et celle appliquée par `Store` ; spécifier l'ordre d'appel, `next`, les dispatchs imbriqués, les exceptions de réducteur et la désinscription. Garder la sortie publique de `createStore` cohérente avec ces choix.
- **Zones :** `src/core/store.ts`, `src/core/middleware.ts`, `src/index.ts`, `src/types/index.ts`, `test/core/store.test.ts`, nouveau `test/core/middleware.test.ts`.
- **Acceptation :** aucune action ou donnée d'état n'est écrite dans la console par défaut ; deux middlewares s'exécutent dans l'ordre documenté ; une exception ne remplace pas l'état ; désinscription idempotente ; comportement d'un dispatch sans changement d'état explicitement documenté et testé.
- **Validation :** tests d'ordre/erreur/réentrance/abonnement, espion `console`, exemple de middleware compilé depuis l'API publique.
- **Dépendances / risques :** après 1.1 ; risque de casser un usage non documenté du middleware, à inventorier avant de figer l'API.

### 1.3 Corriger les helpers et borner la mémoire des sélecteurs

- **Objectif :** éviter les pertes de données et les caches qui grandissent sans limite démontrée.
- **Changements :** faire appliquer toutes les propriétés de `updates` par `updateObject` ou resserrer explicitement son contrat ; définir la politique pour symboles, prototypes et valeurs identiques. Pour `memoize` et `Store.select`, choisir une stratégie de cache bornée ou invalidable et documenter l'identité des entrées, y compris les mutations d'état interdites. Ne garder les optimisations que si elles améliorent un scénario mesuré.
- **Zones :** `src/utils/immutable.ts`, `src/utils/memoize.ts`, `src/core/store.ts`, `test/utils/*`, `test/core/store.test.ts`, docs API.
- **Acceptation :** une propriété ajoutée est présente dans le résultat ; aucune mutation de l'original ; mises à jour hors limites définies ; tests démontrant le nombre maximal d'entrées ou le mécanisme de libération ; résultat de sélecteur correct après chaque transition d'état valide.
- **Validation :** cas limites avec clés ajoutées, tableaux, références et grand nombre d'états/sélecteurs ; profil mémoire documenté plutôt qu'une simple assertion de vitesse.
- **Dépendances / risques :** après 1.1 ; changer la sémantique du cache peut affecter les utilisateurs qui dépendent de la stabilité des références.

### 1.4 Retirer les exemples dangereux

- **Objectif :** empêcher qu'une démo enseigne une pratique non sûre.
- **Changements :** supprimer `examples/auth.html` ou le transformer en **simulation d'état de session sans mot de passe**, affichée comme telle ; ne jamais conserver d'identifiants dans le store de la démo. Dans Todo et Panier, construire le DOM par `textContent` et écouteurs d'événements plutôt que `innerHTML` avec des valeurs d'état et des gestionnaires inline. Retirer la dépendance au CDN Tailwind pour l'artefact public, ou bâtir les styles localement.
- **Zones :** `examples/auth.html`, `examples/todo.html`, `examples/cart.html`, ressources de style des exemples, README.
- **Acceptation :** saisie `<b>Audit</b>` affichée littéralement ; aucun mot de passe ou secret de démo en mémoire/console ; aucun gestionnaire `onclick`/`onchange` généré depuis des données ; la page publique ne requiert pas le CDN de prototypage.
- **Validation :** tests navigateur avec texte hostile, console et parcours clavier ; inspection des ressources chargées et de la page après build.
- **Dépendances / risques :** après 1.2 ; exemple « auth » sans backend ne doit jamais être présenté comme de l'authentification réelle.

## Phase 2 — Faire passer les garde-fous et livrer un paquet consommable (P0)

### 2.1 Réparer TypeScript, lint et le statut du build

- **Objectif :** faire échouer les commandes quand le code ou les déclarations ne sont pas valides.
- **Changements :** corriger les `include`/`rootDir` de `tsconfig.json`, `tsconfig.build.json` et `tsconfig.test.json` ; configurer ESLint 9 avec une configuration compatible ; appliquer le lint aux sources, tests et configurations utiles. Faire précéder ou suivre `tsup` d'un contrôle de types qui propage son code d'échec.
- **Zones :** `tsconfig*.json`, `.eslintrc.js` à remplacer, `package.json`, `tsup.config.ts`, fichiers TypeScript concernés.
- **Acceptation :** `yarn type-check`, `yarn lint`, `yarn test` et `yarn build` passent à partir d'une installation gelée ; une erreur de type volontaire dans une copie de travail fait échouer la commande de release ; aucune sortie `TS18003` masquée.
- **Validation :** exécuter les quatre commandes dans un environnement propre ; test négatif temporaire du code d'échec, puis retrait de cette modification ; inspecter les `.d.ts` générés.
- **Dépendances / risques :** après phase 1 ; corriger la configuration révélera probablement des erreurs de typage aujourd'hui non détectées.

### 2.2 Unifier et prouver les types publics

- **Objectif :** que les exemples TypeScript soient réellement sûrs et agréables à écrire.
- **Changements :** supprimer les définitions concurrentes de `Action`, `Reducer`, `Middleware` et `ActionCreator` entre `src/core/*` et `src/types/index.ts` ; remplacer les `any` publics évitables ; conserver les types littéraux des actions et les types de payload dans `createReducer`, `dispatch` et `select`. Définir un contrat d'état immuable explicite ; ajouter des exemples TypeScript compilables et des tests de types négatifs.
- **Zones :** `src/types/index.ts`, `src/core/*.ts`, `src/index.ts`, nouveau `test/types/*`, `README.md`.
- **Acceptation :** un payload erroné et une action non prévue produisent les erreurs TypeScript attendues ; le code du README compile sans assertion forcée ni `any` implicite ; les déclarations CJS/ESM exposent le même contrat.
- **Validation :** `tsc` sur fixtures consommateur positives et négatives, contrôle du paquet empaqueté depuis un projet distinct.
- **Dépendances / risques :** après 1.1, 1.2 et 2.1 ; inférence trop ambitieuse pouvant compliquer l'API : préférer une API explicite et stable.

### 2.3 Verrouiller les points d'entrée et le contenu npm

- **Objectif :** permettre un `import` fiable depuis Node, navigateur avec bundler et TypeScript, sans publier le dépôt entier.
- **Changements :** définir `exports`, `main`, `module` si utile, `types`, `files`, `sideEffects` et moteurs Node pris en charge ; aligner les chemins avec les fichiers réels de `tsup`. Choisir un seul gestionnaire de paquet et documenter sa version ; ajouter un contrôle prépublication (`prepack` ou commande de release explicite). Décider si un bundle navigateur autonome est nécessaire ; pour une bibliothèque sans CLI, le `.tgz` npm est l'artefact principal, aucun exécutable natif n'est à promettre.
- **Zones :** `package.json`, `tsup.config.ts`, `yarn.lock`, nouveau `test/consumer/*`, guide d'installation.
- **Acceptation :** `npm pack --dry-run` ne contient que licence, README, métadonnées et sorties utiles ; import CJS et ESM, résolution des types et tree shaking attendu vérifiés dans des projets consommateurs vierges ; aucune référence à un fichier absent.
- **Validation :** bâtir, empaqueter, installer le tarball local dans des projets ESM/CJS/TypeScript et exécuter des assertions ; vérifier taille et liste des fichiers du paquet.
- **Dépendances / risques :** après 2.1 et 2.2 ; vérifier l'usage et la disponibilité du nom npm `fluxus` avant toute publication, sans déduire cette disponibilité du seul `package.json`.

### 2.4 Étendre les tests aux échecs et au paquet réel

- **Objectif :** couvrir les frontières où une bibliothèque d'état peut tromper ses utilisateurs.
- **Changements :** compléter les tests unitaires sur actions sans payload, type hérité, middleware, dispatch imbriqué, erreurs, abonnements, sélecteurs, mises à jour et caches ; intégrer les tests de types et les tests consommateurs au script de vérification. Garder des tests orientés comportement plutôt que recopier l'implémentation.
- **Zones :** `test/core/*`, `test/utils/*`, `test/types/*`, `test/consumer/*`, `vitest.config.mts`, `package.json`.
- **Acceptation :** chaque défaut reproduit dans l'audit a un test qui échouerait sur le commit initial ; paquet installé testé séparément des imports `src/` ; aucune sortie de secrets ou d'état dans les journaux par défaut.
- **Validation :** suite complète sur installation propre, test négatif d'un point d'entrée absent, lecture des rapports sans confondre couverture et correction.
- **Dépendances / risques :** après 2.1 à 2.3 ; les tests de paquet peuvent être sensibles aux différences ESM/CJS, à documenter plutôt qu'à ignorer.

### 2.5 Mesurer avant de parler de performance

- **Objectif :** vérifier les promesses de vitesse, d'allocation et de taille, ou les retirer.
- **Changements :** créer un harnais de benchmarks reproductible pour dispatch, abonnement/désabonnement, sélecteurs, charge de plusieurs états et tailles de bundle. Comparer des implémentations équivalentes sur versions épinglées et publier matériel, environnement, nombre d'itérations, dispersion, méthodologie et résultats bruts. Examiner le coût des logs supprimés et des caches ; aucune optimisation sans profil.
- **Zones :** nouveau `bench/`, `package.json`, `docs/BENCHMARKS.md`, `README.md`, `docs/COMPARISON.md`.
- **Acceptation :** un tiers peut reproduire les chiffres ; toute affirmation de supériorité cite un workload précis et ses limites ; en l'absence d'avantage robuste, le positionnement devient simplicité/ergonomie mesurée.
- **Validation :** répétitions sur environnement stable, contrôle de justesse des résultats avant mesure, comparaison du tarball/bundle réel ; benchmarks séparés de la CI bloquante si le bruit matériel est élevé.
- **Dépendances / risques :** après 2.3 ; les microbenchmarks peuvent favoriser un cas irréaliste et masquer les coûts mémoire à long terme.

## Phase 3 — Une première expérience qui montre le produit (P1)

### 3.1 Concevoir une démo principale vérifiable

- **Objectif :** montrer un problème réel résolu en quelques minutes plutôt que quatre formulaires similaires.
- **Changements :** choisir un scénario de petite application (par exemple tâches avec filtres, compteur dérivé et plusieurs vues abonnées) qui met en évidence les actions, les réducteurs, les sélecteurs et la désinscription ; afficher clairement la transition d'état et, seulement si utile, le nombre de recalculs. Fournir des données factices reproductibles et une réinitialisation. Garder les exemples simples existants comme recettes secondaires s'ils passent les critères de sécurité.
- **Zones :** `examples/`, nouveau point d'entrée de démo et ses ressources, `README.md`, éventuel `docs/DEMO.md`.
- **Acceptation :** démarrage documenté depuis un clone propre ; trois interactions principales réussissent ; aucune fausse donnée, aucun backend simulé présenté comme réel, aucun comportement hors du noyau promis ; la démo fonctionne hors ligne si cette propriété est annoncée.
- **Validation :** parcours manuel et test navigateur après build, vérification des erreurs console, recharge et remise à zéro ; capturer la procédure exacte pour la future vidéo.
- **Dépendances / risques :** après phases 1 et 2 ; ne pas développer une grosse application qui cache une petite bibliothèque.

### 3.2 Soigner le rendu, l'accessibilité et le mobile

- **Objectif :** que la première impression visuelle et l'usage au clavier inspirent confiance.
- **Changements :** créer une hiérarchie claire, typographie, contraste, états vides/erreur/chargement pertinents et composants cohérents ; donner des labels aux champs et cases, un retour de focus après actions, des boutons avec noms explicites ; ajuster la mise en page aux petits écrans. Utiliser des styles compilés ou locaux avec licences vérifiées.
- **Zones :** HTML/CSS de `examples/`, ressources de démo et tests navigateur.
- **Acceptation :** aucun débordement horizontal aux largeurs téléphone et bureau retenues ; parcours complet au clavier ; textes accessibles aux lecteurs d'écran ; contrastes validés ; affichage et interactions stables sans avertissement de CDN de développement.
- **Validation :** captures réellement rendues sur plusieurs tailles, navigation clavier et inspection de l'arbre d'accessibilité, audit automatique d'accessibilité complété par contrôle manuel.
- **Dépendances / risques :** après 3.1 et 1.4 ; les retouches visuelles ne doivent pas introduire d'injection ou de dépendance réseau invisible.

### 3.3 Décider l'intégration aux frameworks sur preuve d'usage

- **Objectif :** préserver un noyau léger tout en levant un obstacle d'adoption réel.
- **Changements :** documenter d'abord une intégration vanilla et, si le public de 0.1 le demande, réaliser une recette ou un adaptateur React séparé avec un abonnement compatible avec ses attentes ; éviter d'ajouter React au paquet de base sans besoin. Évaluer de la même façon les besoins de persistance ou de devtools : proposition, coût, compatibilité, décision explicite.
- **Zones :** `src/core/store.ts`, éventuel `packages/` ou `examples/react/`, `docs/INTEGRATIONS.md`, tests d'intégration.
- **Acceptation :** décision « faire / reporter » motivée pour chaque intégration ; si réalisée, aucune dépendance framework dans le cœur et exemple compilé avec mise à jour/désinscription correctes ; si reportée, une recette vanilla pleinement utilisable.
- **Validation :** test d'intégration monté/démonté, absence de fuite d'abonnement, inspection du graphe de dépendances et de la taille du paquet.
- **Dépendances / risques :** après 0.1 et 3.1 ; risque de diluer la valeur avec des adaptateurs peu maintenus.

## Phase 4 — Documentation et présentation GitHub crédibles (P1)

### 4.1 Réécrire le README comme parcours de démarrage

- **Objectif :** permettre le premier succès sans deviner les étapes.
- **Changements :** ouvrir par une promesse vérifiée et un lien vers une démo réelle ; indiquer état de maturité, plateformes testées, installation depuis une version publiée vérifiée ou depuis un tarball local, exemple minimal copiable, comportements des abonnements/sélecteurs, limites et liens vers API, benchmark, comparaison et contribution. Corriger l'exemple `lazy` qui renvoie actuellement un `result` non défini. Éliminer « high performance » et les avantages non mesurés jusqu'à validation.
- **Zones :** `README.md`, `docs/GETTING_STARTED.md`, `docs/API.md`, exemples compilables.
- **Acceptation :** un lecteur peut installer la bonne distribution, exécuter le premier exemple et prévoir son résultat ; chaque commande est testée ; aucun lien mort, badge fictif ou capture sans correspondance avec le produit.
- **Validation :** essai depuis un dossier vierge sur au moins deux environnements pris en charge, lint des liens et rendu Markdown GitHub.
- **Dépendances / risques :** après 2.3 et 3.1 ; ne pas mettre `npm install fluxus` comme preuve de disponibilité tant que la publication n'est pas vérifiée.

### 4.2 Produire des preuves visuelles authentiques

- **Objectif :** faire comprendre le produit en quelques secondes sur GitHub.
- **Changements :** capturer la démo finale réellement exécutée sur navigateur, avec états initial et après interaction, annotations sobres si nécessaires ; ajouter une image de couverture/social preview qui ne promet que ce qui est visible. Héberger une démo statique seulement après build et contrôle de l'URL publique ; relier les captures à la version montrée.
- **Zones :** nouveaux `docs/assets/` ou `media/`, `README.md`, configuration de déploiement statique si retenue, métadonnées GitHub.
- **Acceptation :** captures lisibles, légères et datées par version/commit ; le flux montré est reproductible ; liens de démo et images résolvent publiquement si annoncés ; légendes honnêtes.
- **Validation :** inspection visuelle desktop/mobile, vérification de taille des images et des URL après publication, clics réels sur la démo.
- **Dépendances / risques :** après 3.1 et 3.2 ; des captures peuvent devenir obsolètes à chaque changement de l'interface.

### 4.3 Ouvrir un chemin de contribution et de confiance

- **Objectif :** rendre les contributions et signalements possibles sans ambiguïté.
- **Changements :** écrire `CONTRIBUTING.md` (installation, tests, style, changements d'API), `SECURITY.md` (canal privé et portée), `CODE_OF_CONDUCT.md` adapté, templates d'issues/PR et politique de compatibilité/versionnement. Décrire les limites de support réellement tenables et le processus de tri.
- **Zones :** racine et `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`, `README.md`.
- **Acceptation :** un nouveau contributeur peut lancer les mêmes contrôles que la CI ; le signalement d'une vulnérabilité ne demande pas de publier un secret dans une issue ; les changements cassants ont un processus explicite.
- **Validation :** essai du guide depuis clone vierge, revue des liens et des templates, simulation d'une issue de bug sans données sensibles.
- **Dépendances / risques :** après 2.1 ; promettre une cadence de support non tenue ferait perdre en crédibilité.

## Phase 5 — Automatiser et publier une release vérifiable (P1, bloquante avant vidéo)

### 5.1 Mettre une CI stricte et des contrôles de dépendances

- **Objectif :** rendre visibles les mêmes garde-fous pour chaque contribution.
- **Changements :** workflow GitHub Actions sur PR et branche principale : installation gelée, lint, type-check, tests, build, tests consommateurs et contrôle du tarball ; matrice minimale des versions Node supportées. Ajouter une surveillance raisonnable des dépendances et permissions minimales des workflows. Garder les benchmarks non bloquants sauf seuil robuste démontré.
- **Zones :** `.github/workflows/ci.yml`, configuration des mises à jour de dépendances, `package.json`.
- **Acceptation :** CI échoue sur erreur de type, test, lint, entrée manquante ou paquet cassé ; les jobs réussissent sur les plateformes promises ; badges du README correspondent à de vrais jobs du commit publié.
- **Validation :** exécution des workflows sur PR/test contrôlé puis vérification des résultats GitHub ; ne pas inférer le succès distant depuis les seuls scripts locaux.
- **Dépendances / risques :** après phases 1, 2 et 3 ; coût de maintenance multi-plateforme, permissions de publication à limiter.

### 5.2 Préparer la version et ses artefacts

- **Objectif :** livrer une version dont le contenu et la compatibilité sont explicites.
- **Changements :** choisir une politique SemVer adaptée à la maturité réelle ; tenir `CHANGELOG.md`, notes de migration et liste des changements depuis `0.1.0`. Mettre une commande `release-check` ou équivalent qui reconstruit, teste, vérifie le paquet, ses exports, licences, taille et checksum SHA-256. Ne pas fabriquer de « binaires » natifs : Fluxus n'est ni un CLI ni une application ; joindre au besoin le tarball npm et son hash à la release GitHub.
- **Zones :** `package.json`, `CHANGELOG.md`, `docs/RELEASE.md`, scripts de release, `README.md`.
- **Acceptation :** artefact versionné installable depuis un dossier vierge, manifest exact, changelog synchronisé, hash identique entre fichier préparé et fichier joint ; aucun secret dans le paquet.
- **Validation :** essai d'installation du `.tgz` local, `npm pack --dry-run`, extraction et inspection des fichiers, scripts de vérification complets.
- **Dépendances / risques :** après 5.1 ; la version `0.1.0` du manifest ne prouve pas une publication existante.

### 5.3 Publier puis vérifier npm et GitHub, si les accès sont disponibles

- **Objectif :** transformer l'artefact validé en release accessible aux utilisateurs.
- **Changements :** confirmer le propriétaire/nom du paquet npm et les droits de publication ; publier l'artefact testé via un mécanisme sûr (provenance et identité courte durée si disponibles), créer un tag et une GitHub Release avec notes et checksum, puis mettre les instructions d'installation à jour. Si la démo est hébergée, déployer son build correspondant au tag.
- **Zones :** registre npm, dépôt GitHub, workflow de release ou procédure `docs/RELEASE.md`, `README.md`, éventuelle démo statique.
- **Acceptation :** version et tarball visibles dans le registre sous le bon propriétaire ; installation de cette **version exacte** dans un projet vierge ; tag et release distants pointent vers le commit validé ; lien public de démo testé ; sinon statut explicite « prêt localement, publication non vérifiée/bloquée » et pas de badge ou affirmation de release.
- **Validation :** vérifier les réponses du registre, le checksum téléchargé, la release GitHub et une exécution consommateur de l'artefact publié ; contrôler l'URL publique plutôt que le seul résultat de l'upload.
- **Dépendances / risques :** après 5.2 ; nom déjà occupé, identifiants et règles du registre, approbations externes et propagation ; ne jamais injecter de secret dans le dépôt ou les logs.

## Phase 6 — Vérifier l'adoption avant le film final (P2)

### 6.1 Observer un premier usage indépendant et corriger les obstacles

- **Objectif :** vérifier que la documentation et la proposition de valeur marchent hors de l'équipe du projet.
- **Changements :** demander à quelques développeurs consentants d'effectuer le scénario de 0.1 avec la version publiée, sans assistance initiale ; relever seulement les blocages et retours anonymisés, les classer et corriger les obstacles de démarrage. Ouvrir des issues traçables pour les suggestions reportées ; ne pas présenter ces retours comme une adoption large.
- **Zones :** `docs/USER_FEEDBACK.md` ou issues anonymisées, README, démo et code selon les bugs constatés.
- **Acceptation :** au moins trois parcours indépendants consignés avec version, tâche, résultat et difficulté ; les blocages critiques sont corrigés et validés sur la release suivante, ou la phase reste ouverte avec raison explicite.
- **Validation :** rejouer les parcours après correction, vérifier les nouveaux artefacts et liens ; séparer observations humaines, statistiques publiques et hypothèses de croissance.
- **Dépendances / risques :** après 5.3 ; disponibilité de participants et consentement ; ne pas publier de données personnelles ou d'avis inventés.

### 6.2 Présenter le projet là où son public peut le découvrir

- **Objectif :** favoriser découvertes, partages et contributions sans promettre de nombre de stars.
- **Changements :** renseigner description courte, topics, social preview et lien de démo du dépôt ; préparer une courte présentation honnête avec un cas d'usage, le compromis assumé et les preuves (release, bench si solide, capture, exemple). Partager dans des communautés pertinentes seulement quand la version et les ressources sont publiques ; répondre aux retours et maintenir les issues initiales.
- **Zones :** métadonnées GitHub, README, `docs/COMPARISON.md`, liens de démo et notes de release.
- **Acceptation :** chaque lien mène à une ressource fonctionnelle et à la même version ; messages de présentation vérifiables ; un nouveau visiteur trouve installation, démo, limites et contribution depuis la page GitHub.
- **Validation :** revue de la page publique et des liens après publication ; retour qualitatif et usage du paquet suivis séparément des stars.
- **Dépendances / risques :** après 5.3 et idéalement 6.1 ; une publication de communication ne prouve pas l'adoption.

## Phase 7 — Vidéo de démonstration réelle du produit terminé (dernière phase)

**Verrou d'entrée :** démarrer cette phase uniquement après implémentation **et validation** des phases 0 à 6, y compris le parcours réel, la release et les liens publics annoncés. Si un accès, une publication ou l'essai indépendant reste bloqué, laisser cette phase en attente. Ne pas produire une vidéo de substitut à partir de maquettes ou d'un build non publié.

### 7.1 Capturer un parcours authentique et monter la vidéo

- **Objectif :** donner une preuve concise du problème résolu par la version finale.
- **Changements :** utiliser **obligatoirement la skill `ffmpeg-video-editor`** ; préparer un script basé sur la release vérifiée, capturer l'écran pendant une utilisation réelle, montrer d'abord le problème concret, puis l'installation ou le démarrage depuis un environnement propre, puis les fonctions principales et le résultat obtenu. Garder les erreurs éventuelles visibles dans la préparation et refaire la prise après correction, jamais avec des écrans fictifs. Monter avec coupes rythmées, titres sobres, zooms/recadrages qui rendent le code et l'interface lisibles, et audio propre si une voix ou une musique autorisée est utilisée.
- **Zones :** capture réelle de la démo et du terminal, projet de montage reproductible, nouveaux `media/demo/` et liens dans `README.md`/release.
- **Acceptation :** chaque fonction montrée est traçable à l'artefact final ; installation et interactions réussissent dans la prise ; aucun chiffre ou bénéfice non démontré ; version principale adaptée au README/GitHub, plus courte version sociale si son format sert réellement le message.
- **Validation :** rejouer le scénario avec le tag et le paquet exacts, relire le montage contre le script et les sources, vérifier licences éventuelles de l'audio et absence de secrets visibles.
- **Dépendances / risques :** toutes les phases précédentes ; perte de lisibilité du code, fuite de données de la machine, montage qui suggère une capacité absente.

### 7.2 Contrôler le fichier livré de bout en bout

- **Objectif :** fournir un média qui se lit réellement et reste raisonnable à charger.
- **Changements :** exporter une vidéo web compatible (par exemple MP4 H.264/AAC avec `yuv420p` et `faststart` si l'audio existe), une vignette issue d'une vraie image, et la variante courte retenue. Utiliser `ffprobe` de la skill pour durée, résolution, fréquence, codecs, débit et poids ; décoder le fichier entier avec FFmpeg et le visionner intégralement avant de lier le README. Adapter l'hébergement si le poids est excessif pour Git.
- **Zones :** `media/demo/`, README et release ou hébergeur de médias choisi.
- **Acceptation :** durée, résolution, codecs et poids documentés ; décodage complet sans erreur, lecture humaine complète réussie, liens et vignette testés sur la page GitHub ; format social vérifié séparément s'il existe.
- **Validation :** `ffprobe`, décodage intégral FFmpeg, lecture dans au moins un navigateur et contrôle après mise en ligne ; hash du fichier final si joint à la release.
- **Dépendances / risques :** après 7.1 ; une exportation réussie ne garantit ni lecture complète ni compatibilité GitHub.

## Résultat attendu

À l'issue des phases 0 à 6, Fluxus devrait être une petite bibliothèque d'état au contrat stable, sécurisée dans ses exemples, typée et testée jusque dans son tarball, accompagnée d'une démo réellement utilisable, d'une documentation honnête et d'une release vérifiée. La phase 7 ajoutera une preuve vidéo du **produit final**. La qualité et la facilité d'essai peuvent augmenter ses chances d'être adopté et partagé ; aucun roadmap ne peut garantir un nombre de stars.
