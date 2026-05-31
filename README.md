# 🐱 Lofi Cat Runner

Un jeu *endless runner* en pixel art / lofi, inspiré du jeu du dinosaure de Chrome.
Le joueur incarne un chat qui court dans un décor urbain nocturne et saute par-dessus
les obstacles. Score, classement mondial en ligne, skins, musique générée et fond animé.

🎮 **Jouer en ligne :** https://lofi-cat-runner.netlify.app/

---

## Fonctionnalités

- Jeu sur `<canvas>` avec boucle d'animation (`requestAnimationFrame`)
- Choix d'un pseudo et de plusieurs skins de chat (+ personnage spécial)
- Musique lofi et effets sonores générés en temps réel (Web Audio API)
- Décor multi-couches : étoiles, ville en parallaxe, lampadaires, fond vidéo
- Objets à collecter : poissons (points bonus) et étoile (invincibilité 10 s)
- Classement mondial partagé en ligne avec podium, badges top 3 et compte à rebours
- Panneau d'administration pour modérer le classement

## Technologies

- HTML / CSS / JavaScript (sans framework)
- API Canvas 2D et Web Audio API
- **Netlify Functions** (serverless) pour les opérations sensibles
- Service de leaderboard Dreamlo (base de données distante)
- Hébergement : Netlify, avec déploiement continu depuis GitHub

## Architecture & sécurité

Le projet associe un **front-end statique** et des **fonctions serveur** :

- `index.html` — tout le jeu (rendu, logique, audio, interface).
- `netlify/functions/scores.js` — relais sécurisé vers Dreamlo (lecture / ajout / suppression de scores).
- `netlify/functions/admin-login.js` — vérification du mot de passe administrateur **côté serveur**.

**Aucun secret n'est présent dans le code front-end.** Les codes Dreamlo et les
identifiants d'administration sont stockés dans les **variables d'environnement** de
Netlify et ne sont utilisés que côté serveur. Le site est servi en **HTTPS**, et
l'authentification admin est revérifiée par le serveur à chaque action sensible.

### Variables d'environnement requises (Netlify)

| Clé | Description |
|-----|-------------|
| `DREAMLO_PUBLIC`  | code public Dreamlo (lecture)        |
| `DREAMLO_PRIVATE` | code privé Dreamlo (écriture) — secret |
| `ADMIN_USER`      | identifiant administrateur           |
| `ADMIN_PASS`      | mot de passe administrateur — secret |

## Lancer en local

Ouvrir `index.html` dans un navigateur (garder `bg.mp4` dans le même dossier).
Note : les fonctions serveur (classement en ligne, admin) nécessitent l'environnement
Netlify ; en local sans Netlify CLI, le jeu bascule sur un classement local de secours.

## Déploiement

Site hébergé sur Netlify avec déploiement continu : chaque `git push` sur la branche
`main` redéploie automatiquement le site et ses fonctions. Voir `dossier-rendu.md`
pour le détail des choix techniques, des étapes de déploiement et des difficultés rencontrées.

---

*Projet réalisé dans le cadre du TP Projet Final — par Ephi.*
