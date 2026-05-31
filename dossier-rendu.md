# Dossier de rendu — Lofi Cat Runner

**Auteur :** Ephi
**Type de projet :** application web (jeu navigateur) déployée
**URL en ligne :** https://lofi-cat-runner.netlify.app/
**Dépôt GitHub :** https://github.com/Ephisios/lofi-cat-runner

---

## 1. Présentation du projet

Lofi Cat Runner est un jeu de type *endless runner* (inspiré du jeu du dinosaure de Chrome `chrome://dino`), réinterprété avec un univers pixel art / lofi. Le joueur incarne un chat qui court dans un décor urbain nocturne et doit sauter par-dessus des obstacles (poubelles, barrières de chantier, bancs). Le score augmente avec la distance parcourue, la difficulté s'accentue progressivement, et un classement mondial en ligne permet aux joueurs de se comparer.

Le jeu propose plusieurs fonctionnalités notables :

- Choix d'un pseudo et de plusieurs skins de personnage (dont un personnage spécial « Guts » avec ambiance dédiée).
- Musique lofi générée en temps réel et effets sonores (Web Audio API, sans fichier audio externe).
- Décor animé multi-couches : étoiles scintillantes, silhouette de ville en parallaxe, lampadaires lumineux, fond vidéo.
- Objets à collecter (poissons = points bonus, étoile = invincibilité temporaire).
- Classement mondial partagé en ligne avec podium, badges top 3, panneau d'administration et compte à rebours.

---

## 2. Solution technique retenue

### 2.1 Architecture

Le projet associe un **front-end statique** et des **fonctions serveur (serverless)** :

- Front-end : un fichier `index.html` contenant le HTML, le CSS et le JavaScript, accompagné d'un fichier vidéo de fond (`bg.mp4`). Le rendu du jeu repose sur l'élément `<canvas>` et une boucle d'animation via `requestAnimationFrame`.
- Back-end : deux **Netlify Functions** (`scores.js` et `admin-login.js`) qui gèrent les échanges sensibles avec le service de classement et l'authentification administrateur.

Ce choix d'une application statique enrichie de fonctions serverless est justifié par la nature du projet :

- Toute la logique de jeu s'exécute côté client (performances optimales, pas de latence).
- Les opérations sensibles (secrets, authentification) sont déléguées au serveur, sans avoir à maintenir un serveur permanent.

### 2.2 Persistance des données (classement)

Le classement mondial est géré via **Dreamlo**, un service de leaderboard en ligne gratuit qui joue le rôle de base de données distante. Les scores sont :

- envoyés à Dreamlo à chaque fin de partie (via la fonction serveur) ;
- relus à l'affichage du classement (top 10 sur la page, top 4 en fin de partie avec podium).

Une copie locale des scores est également conservée dans le `localStorage` du navigateur, servant de solution de repli si le service en ligne est momentanément indisponible.

### 2.3 Choix d'hébergement

L'hébergement est assuré par **Netlify** (Platform as a Service). Comparaison des options envisagées :

- **PaaS (Netlify / Vercel)** — retenu : déploiement en quelques secondes, HTTPS automatique, CDN mondial, fonctions serverless intégrées, variables d'environnement sécurisées, offre gratuite généreuse.
- **VM / VPS** — écarté : surdimensionné pour ce projet, nécessiterait de configurer manuellement un serveur web, les certificats SSL, etc., pour aucun bénéfice ici.

Netlify offre donc le meilleur rapport simplicité / fiabilité / sécurité pour ce type de projet.

---

## 3. Étapes de déploiement

1. Développement et test en local (ouverture du fichier `index.html` dans le navigateur).
2. Mise en place d'un dépôt **GitHub** pour le versionnement du code.
3. Connexion du dépôt à **Netlify** : chaque `git push` déclenche un **redéploiement automatique** (déploiement continu).
4. Configuration des **variables d'environnement** sur Netlify (codes Dreamlo, identifiants admin) — jamais dans le code.
5. Vérification du bon fonctionnement en conditions réelles (test multi-joueurs sur plusieurs machines, test des fonctions serveur).

URL finale : `https://lofi-cat-runner.netlify.app/`

---

## 4. Difficultés rencontrées et solutions

### 4.1 Le classement n'était pas partagé entre joueurs

**Problème :** chaque joueur ne voyait que ses propres scores.

**Cause racine :** Dreamlo en version gratuite n'autorise pas le HTTPS (« SSL not enabled for this leaderboard »). La page Netlify étant en HTTPS, le navigateur bloquait les requêtes vers le service en HTTP (contenu mixte / CORS), et le code basculait silencieusement sur le classement local.

**Solution :** déléguer les appels Dreamlo à une **fonction serveur** (Netlify Function). Côté serveur, l'appel HTTP passe sans restriction, ce qui contourne à la fois le blocage SSL et les problèmes de CORS. Cette solution a aussi permis de sécuriser les secrets (voir section 5).

### 4.2 Lecture audio bloquée au chargement

**Problème :** la musique de fond ne démarrait pas automatiquement.
**Cause :** les navigateurs interdisent la lecture audio tant que l'utilisateur n'a pas interagi avec la page.
**Solution :** initialisation du contexte audio (Web Audio API) au premier clic ou à la première touche.

### 4.3 Réglage de la difficulté

Plusieurs itérations ont été nécessaires pour équilibrer le jeu : vitesse de départ, rythme d'accélération, espacement des obstacles et fréquence des regroupements, afin d'obtenir une courbe de difficulté progressive et juste.

---

## 5. Sécurité et bonnes pratiques

La sécurité a fait l'objet d'un soin particulier : aucun secret n'est exposé dans le code envoyé au navigateur.

**Mesures mises en place :**

- Le site est servi intégralement en **HTTPS** (fourni automatiquement par Netlify).
- **Secrets non exposés** : les codes Dreamlo (public et privé) et les identifiants d'administration ne figurent **pas** dans le code front-end. Ils sont stockés dans les **variables d'environnement** de Netlify et utilisés uniquement par les fonctions serveur. Les valeurs sensibles (`DREAMLO_PRIVATE`, `ADMIN_PASS`) sont marquées comme secrètes dans l'interface Netlify.
- **Architecture sécurisée** : le navigateur n'appelle jamais Dreamlo directement. Il passe par deux fonctions serverless :
  - `scores.js` : relais pour lire, ajouter et supprimer des scores (le code privé Dreamlo reste côté serveur) ;
  - `admin-login.js` : vérification du mot de passe administrateur **côté serveur**.
- **Authentification admin côté serveur** : la suppression d'un score exige que le mot de passe soit revérifié par le serveur à chaque action ; une tentative avec un mauvais mot de passe renvoie une erreur 401 (testé et vérifié).
- Aucune donnée personnelle sensible n'est collectée (seul un pseudo choisi par le joueur est stocké).
- Le code de production a été nettoyé de tous les messages de débogage (`console.log`).

**Vérification :** l'inspection du code source de la page en ligne confirme qu'aucun secret n'y est présent.

**Limite résiduelle assumée :** l'authentification admin repose sur un mot de passe simple sans système de session/token. Pour un usage plus exigeant, on ajouterait un jeton de session signé avec expiration. Ce niveau reste cohérent avec le contexte (modération d'un classement de jeu).

---

## 6. Bilan et pistes d'amélioration

Le projet remplit son objectif : une application web fonctionnelle, accessible publiquement, versionnée sur GitHub avec déploiement continu, hébergée sur une plateforme adaptée, avec un classement en ligne partagé opérationnel et des secrets correctement protégés côté serveur.

Pistes d'amélioration identifiées :

- Authentification admin par jeton de session signé (au lieu d'un simple mot de passe).
- Base de données privée dédiée (au lieu du service Dreamlo) pour un contrôle total des données.
- Découpage du code front-end en plusieurs fichiers (HTML / CSS / JS séparés) pour améliorer la maintenabilité.
- Optimisation mobile (contrôles tactiles, mise en page responsive).

---

*Document rédigé dans le cadre du TP Projet Final — par Ephi.*
