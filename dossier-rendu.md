# Dossier de rendu — Lofi Cat Runner

**Auteur :** Ephi
**Type de projet :** application web (jeu navigateur) déployée
**URL en ligne :** https://ynovpatpat.netlify.app/

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

Le projet est une application **front-end statique** : un unique fichier `index.html` contenant le HTML, le CSS et le JavaScript, accompagné d'un fichier vidéo de fond (`bg.mp4`). Le rendu du jeu repose sur l'élément `<canvas>` et une boucle d'animation via `requestAnimationFrame`.

Ce choix d'une application purement statique est justifié par la nature du projet :

- Aucun traitement serveur n'est nécessaire pour faire tourner le jeu (toute la logique s'exécute côté client).
- Le déploiement et l'hébergement sont simplifiés et gratuits.
- Les performances sont excellentes (chargement quasi instantané, pas de latence serveur).

### 2.2 Persistance des données (classement)

Le classement mondial est géré via **Dreamlo**, un service de leaderboard en ligne gratuit qui joue le rôle de base de données distante. Les scores sont :

- envoyés à Dreamlo à chaque fin de partie ;
- relus à l'affichage du classement (top 10 sur la page, top 4 en fin de partie avec podium).

Une copie locale des scores est également conservée dans le `localStorage` du navigateur, servant de solution de repli si le service en ligne est momentanément indisponible.

### 2.3 Choix d'hébergement

L'hébergement est assuré par **Netlify** (Platform as a Service). Comparaison des options envisagées :

- **PaaS (Netlify / Vercel)** — retenu : déploiement en quelques secondes, HTTPS automatique, CDN mondial, offre gratuite généreuse, idéal pour un site statique.
- **VM / VPS** — écarté : surdimensionné pour un site statique, nécessiterait de configurer manuellement un serveur web (Nginx/Apache), les certificats SSL, etc., pour aucun bénéfice ici.

Netlify offre donc le meilleur rapport simplicité / fiabilité pour ce type de projet.

---

## 3. Étapes de déploiement

1. Développement et test en local (ouverture du fichier `index.html` dans le navigateur).
2. Mise en ligne sur Netlify via *Netlify Drop* (glisser-déposer du dossier contenant `index.html` et `bg.mp4`).
3. Personnalisation du sous-domaine du site pour obtenir une URL propre : `https://ynovpatpat.netlify.app/`.
4. Configuration des identifiants Dreamlo (code public + code privé) pour activer le classement en ligne partagé.
5. Vérification du bon fonctionnement en conditions réelles (test multi-joueurs sur plusieurs machines).

---

## 4. Difficultés rencontrées et solutions

### 4.1 Le classement n'était pas partagé entre joueurs

**Problème :** chaque joueur ne voyait que ses propres scores. Le diagnostic a révélé que le classement était en réalité resté en mode local.

**Cause racine :** Dreamlo en version gratuite n'autorise pas le HTTPS (réponse « SSL not enabled for this leaderboard »). Or la page Netlify étant servie en HTTPS, le navigateur bloquait les requêtes vers le service en HTTP (problème de *contenu mixte* / CORS), et le code basculait silencieusement sur le classement local.

**Solution :** faire transiter les appels à Dreamlo par un relais (proxy CORS, `api.codetabs.com`) qui interroge la version HTTP du service côté serveur, contournant ainsi le blocage. Lecture, écriture et suppression de scores ont ensuite fonctionné correctement, et le classement est devenu réellement partagé.

### 4.2 Lecture audio bloquée au chargement

**Problème :** la musique de fond ne démarrait pas automatiquement.

**Cause :** les navigateurs interdisent la lecture audio tant que l'utilisateur n'a pas interagi avec la page.

**Solution :** initialisation du contexte audio (Web Audio API) au premier clic ou à la première touche de l'utilisateur, conformément aux règles des navigateurs.

### 4.3 Réglage de la difficulté

Plusieurs itérations ont été nécessaires pour équilibrer le jeu : ajustement de la vitesse de départ, du rythme d'accélération, de l'espacement des obstacles et de la fréquence des regroupements d'obstacles, afin d'obtenir une courbe de difficulté progressive et juste.

---

## 5. Sécurité et bonnes pratiques

Par transparence, voici une analyse honnête de l'état de sécurité du projet et de ses limites.

**Points respectés :**

- Le site est servi intégralement en **HTTPS** (fourni automatiquement par Netlify).
- Aucune donnée personnelle sensible n'est collectée (seul un pseudo choisi par le joueur est stocké).
- Le code de production a été nettoyé des messages de débogage superflus.

**Limites assumées :**

- Le **code privé Dreamlo** et le **mot de passe du panneau d'administration** sont présents dans le code front-end, donc théoriquement consultables par un utilisateur examinant le code source de la page. C'est une limite inhérente à une application 100 % front-end sans backend : il n'existe pas de zone réellement « secrète » côté client.
- Pour une mise en production réelle et sécurisée, il faudrait introduire un backend (API) qui détiendrait les secrets et vérifierait l'authentification côté serveur, ainsi qu'une base de données privée. Cette évolution est identifiée comme la principale piste d'amélioration.

Cette lucidité sur les compromis fait partie de la démarche : le niveau de sécurité retenu est cohérent avec le contexte (projet de jeu, scores non critiques), tout en identifiant clairement ce qu'exigerait un passage en production.

---

## 6. Bilan et pistes d'amélioration

Le projet remplit son objectif : une application web fonctionnelle, accessible publiquement, hébergée sur une plateforme adaptée, avec une fonctionnalité de classement en ligne partagé opérationnelle.

Pistes d'amélioration identifiées :

- Ajout d'un véritable backend et d'une base de données privée pour sécuriser les secrets et l'authentification.
- Mise en place d'un dépôt Git et d'un déploiement continu (CI/CD) connecté à l'hébergeur.
- Découpage du code en plusieurs fichiers (HTML / CSS / JS séparés) pour améliorer la maintenabilité.
- Optimisation mobile (contrôles tactiles, mise en page responsive).

---

*Document rédigé dans le cadre du TP Projet Final.*
