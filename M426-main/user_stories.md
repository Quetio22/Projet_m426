# User Stories Dev Projet
##  Authentification (Tokens)
1) En tant que visiteur

Je veux créer un compte
Afin de pouvoir utiliser les fonctionnalités du site.

2) En tant qu’utilisateur

Je veux pouvoir m’authentifier avec un nom d’utilisateur et un mot de passe
Afin de sécuriser l’accès à mes données.

3) En tant qu’utilisateur

Je veux pouvoir me déconnecter
Afin de sécuriser mon compte et invalider mon token.

##  Gestion de mon compte (Users)
4) En tant qu’utilisateur

Je veux pouvoir consulter mes données
Afin de voir les informations liées à mon compte.

5) En tant qu’utilisateur

Je veux pouvoir modifier mes informations (nom d’utilisateur, mot de passe)
Afin de garder mon profil à jour.

6) En tant qu’utilisateur

Je veux pouvoir supprimer mon compte
Afin de supprimer définitivement mon accès au service.

7) En tant qu’utilisateur

Je veux recevoir des messages d’erreur clairs
Afin de comprendre ce qui ne fonctionne pas lors de mes actions.

8) En tant que développeur

Je veux que les données envoyées soient validées
Afin de garantir la cohérence et la sécurité du système.

##  Conversations
9) En tant qu’utilisateur

Je veux créer une conversation avec un ou plusieurs participants
Afin de démarrer une discussion.

10) En tant qu’utilisateur

Je veux consulter la liste de mes conversations
Afin d’accéder rapidement à mes échanges.

11) En tant qu’utilisateur

Je veux consulter les détails d’une conversation
Afin de voir les participants et les informations associées.

##  Messages
12) En tant qu’utilisateur

Je veux envoyer un message dans une conversation
Afin de communiquer avec les autres participants.

13) En tant qu’utilisateur

Je veux récupérer les messages d’une conversation
Afin de suivre le fil de la discussion.

14) En tant qu’utilisateur

Je veux marquer un message comme lu
Afin d’indiquer que j’ai pris connaissance du message.

15) En tant qu’utilisateur

Je veux supprimer un message uniquement pour moi
Afin de nettoyer mon interface sans impacter les autres participants.

16) En tant qu’utilisateur

Je veux voir si mes messages ont été lus ou supprimés par les participants
Afin de suivre l’évolution de la conversation.

17) En tant qu’utilisateur

Je veux naviguer dans les messages avec pagination
Afin de consulter efficacement les longues discussions.

##  Participants (conversations)
18) En tant qu’utilisateur

Je veux consulter la liste des participants d’une conversation
Afin de connaître les personnes impliquées.

19) En tant qu’utilisateur

Je veux pouvoir ajouter un ou plusieurs participants lors de la création d’une conversation
Afin de former un groupe directement.

20) En tant qu’utilisateur

Je veux pouvoir changer mon propre statut de participant (ex : ACTIVE → INACTIVE)
Afin de me retirer d’une conversation.

21) En tant que propriétaire d’une conversation de groupe

Je veux pouvoir bloquer un participant non propriétaire
Afin de gérer les accès à la conversation.

22) En tant que propriétaire d’une conversation de groupe

Je veux pouvoir promouvoir un participant au rôle de propriétaire
Afin de partager la gestion du groupe.

## Sécurité & Conformité API
23) En tant qu’utilisateur

Je veux que toutes les actions sensibles nécessitent un token valide
Afin de protéger mes données.

24) En tant qu’utilisateur

Je veux être protégé contre les abus (limites de requêtes)
Afin de garantir la stabilité du service.

25) En tant qu’utilisateur

Je veux que les messages d’un utilisateur supprimé soient anonymisés
Afin de conserver l’historique tout en respectant sa confidentialité.

Je veux que les messages d’un utilisateur supprimé soient anonymisés
Afin de conserver l’historique tout en respectant sa confidentialité.

#ADMIN

## 🟥 Gestion des utilisateurs
A1) En tant qu’administrateur

Je veux pouvoir consulter la liste de tous les utilisateurs
Afin de superviser l’activité globale du système.

A2) En tant qu’administrateur

Je veux pouvoir rechercher un utilisateur par nom, email ou numéro
Afin de retrouver rapidement un compte spécifique.

A3) En tant qu’administrateur

Je veux pouvoir supprimer définitivement un utilisateur
Afin de retirer l’accès à un compte non autorisé ou frauduleux.

## 🟥 Gestion des conversations
A4) En tant qu’administrateur

Je veux voir toutes les conversations du système
Afin de superviser le bon fonctionnement de la plateforme.

A5) En tant qu’administrateur

Je veux pouvoir supprimer une conversation
Afin d’intervenir en cas de contenus inappropriés ou illégaux.

A6) En tant qu’administrateur

Je veux pouvoir voir les participants d’une conversation
Afin de comprendre rapidement qui y prend part.

## 🟥 Gestion des messages
A7) En tant qu’administrateur

Je veux consulter tous les messages d’une conversation
Afin d’analyser un problème ou un incident signalé.

A8) En tant qu’administrateur

Je veux pouvoir supprimer un message inapproprié
Afin de maintenir un environnement sécurisé et conforme.

## 🟥 Gestion des rôles et permissions
A9) En tant qu’administrateur

Je veux pouvoir promouvoir un utilisateur au rôle de modérateur
Afin de déléguer certaines responsabilités de surveillance.

A10) En tant qu’administrateur

Je veux définir les permissions d’accès des différents rôles
Afin de contrôler précisément ce que chaque utilisateur peut faire.

## 🟥 Gestion du système (Monitoring)
A11) En tant qu’administrateur

Je veux pouvoir consulter les logs d’activité
Afin de détecter des comportements anormaux ou des erreurs.

A12) En tant qu’administrateur

Je veux être alerté automatiquement en cas d’erreurs critiques
Afin d’intervenir rapidement.

## 🟥 Gestion de la sécurité
A13) En tant qu’administrateur

Je veux pouvoir forcer la déconnexion d’un utilisateur
Afin de protéger un compte compromis.

A14) En tant qu’administrateur

Je veux pouvoir réinitialiser le mot de passe d’un utilisateur
Afin de l’aider en cas d’impossibilité d’accès.

