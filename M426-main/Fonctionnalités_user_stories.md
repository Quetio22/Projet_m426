# Création des fonctionnalitées 


## Fonctionnalitées pour l'authentification 

1) En tant que visiteur Je veux créer un compte Afin de pouvoir utiliser les fonctionnalités du site.

 

  ### création de compte 

   #### Backend

POST /auth/register

Body :

{ "username": "test", "password": "123456" }


Vérifications :

username unique

password hashé

Retour :

{ "message": "User created" }

#### Frontend

Formulaire d’inscription

Appel API →  fficher succès ou erreur

---


### Login authentification 

#### Backend

POST /auth/login

Vérifie username + password

Génère un JWT

Retourne :

{ "token": "xxxx" }

#### Frontend

Formulaire login

Stockage token

Redirection vers dashboard

test git
