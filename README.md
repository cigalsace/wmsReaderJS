# wmsReaderJS

Application javascript de lecture d'un flux WMS via une requête GetCapabilities.
Cette application s'inspire des travaux du projet mdViewer.

Elle permet simplement de lire le flux et de présenter un certains nombre d'information selon une interface accessible et lisible.
Elle est basée sur une logique client/serveur.

*La branche "master" est la branche de développement.*

## Technologie:

Le module wmsReaderJS est développé principalement via du JavaScript, du HTML, du CSS 3. Il s'apuie notamment sur les bibliothèques suivantes:

* [JQuery][1] pour l'interaction javacript
* [Mustache][2] et Mustache.js comme système de template pour la mise en forme des pages HTML
* [Uikit][3] pour la présentation des pages et le rendu

Un script PHP est utilisé pour appeler les pages distantes et permettre de réaliser des requêtes AJAX "cross-domain". Il peut être facilement remplacé par un script dans un autre langage comme Python, Java ou autre (développement à prévoir).

## Principe:

A partir d'une URL vers un serveur WMS, le module génère une requête de type GetCapabilities et affiche les données du service envoyée en retour selon un modèle (template).

## Installation:

* Télécharger le fichier zip contenant les sources.
* Dézipper le fichier téléchargé sur le serveur
* L'application est fonctionnelle.

## Paramétrage:

Les paramétrages s'affectuent dans le fichier js/config.js.

## Utilisation:

L'application se veut simple et intuitive...

## Démonstration:

http://www.cigalsace.net/wmsReaderJS/0.01/

---
[1]: http://jquery.com/
[2]: http://mustache.github.io/
[3]: http://getuikit.com/