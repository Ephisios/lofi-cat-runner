# 🐱 Lofi Cat Runner

Un jeu *endless runner* en pixel art / lofi, inspiré du jeu du dinosaure de Chrome.
Le joueur incarne un chat qui court dans un décor urbain nocturne et saute par-dessus
les obstacles. Score, classement mondial en ligne, skins, musique générée et fond animé.

🎮 **Jouer en ligne :** https://ynovpatpat.netlify.app/

---

## Fonctionnalités

- Jeu sur `<canvas>` avec boucle d'animation (`requestAnimationFrame`)
- Choix d'un pseudo et de plusieurs skins de chat (+ personnage spécial)
- Musique lofi et effets sonores générés en temps réel (Web Audio API)
- Décor multi-couches : étoiles, ville en parallaxe, lampadaires, fond vidéo
- Objets à collecter : poissons (points bonus) et étoile (invincibilité 10 s)
- Classement mondial partagé en ligne (Dreamlo) avec podium, badges et compte à rebours
- Panneau d'administration pour modérer le classement

## Technologies

- HTML / CSS / JavaScript (sans framework)
- API Canvas 2D et Web Audio API
- Service de leaderboard en ligne Dreamlo
- Hébergement : Netlify

## Lancer en local

Ouvrir simplement `index.html` dans un navigateur (garder `bg.mp4` dans le même dossier).

## Déploiement

Site statique hébergé sur Netlify. Voir `dossier-rendu.md` pour le détail des choix
techniques, des étapes de déploiement et des difficultés rencontrées.

---

*Projet réalisé dans le cadre du TP Projet Final — par Ephi.*
