# E-mails Shopify aux couleurs SORI

Objectif : que tous les e-mails automatiques (confirmation de compte, de commande,
d'expédition, etc.) soient en **noir + jaune acide** au lieu du bleu Shopify standard.

Sur le plan Basic, ces e-mails ne se modifient pas par l'API : ça se fait dans l'admin,
en 2 étapes.

## Étape 1 — Branding global (2 min, couvre TOUS les e-mails)

**Admin Shopify → Réglages → Notifications → « Personnaliser » (en haut) :**
- **Logo** : ajoute le logo SORI
- **Couleur d'accentuation** : `#D8F000` (jaune acide)

À lui seul, ça change le logo + la couleur des boutons dans **tous** les e-mails.

## Étape 2 — Skin noir complet (optionnel, par e-mail)

Pour aller au bout (fond noir, typo, tableaux), colle le bloc du fichier
`sori-notification-style.html` dans chaque modèle :

1. **Réglages → Notifications** → clique un e-mail (ex. « Confirmation de commande »)
2. Bouton **« Modifier le code »**
3. Trouve la balise `</style>` (vers le haut du code) et **colle le bloc juste avant**
4. **Enregistrer**

Le bloc ne touche qu'au style : les variables `{{ ... }}` (montants, articles,
adresse…) restent intactes. Zéro risque de casser une commande.

## Les e-mails que le client voit le plus (à faire en priorité)

| Modèle Shopify | Quand |
|---|---|
| Confirmation du compte client | à la création de compte |
| Réinitialisation du mot de passe | mot de passe oublié |
| **Confirmation de commande** | après un achat ← le plus important |
| Confirmation d'expédition | quand tu expédies |
| Mise à jour d'expédition / Sortie pour livraison / Livré | suivi |
| Commande annulée / Remboursement | SAV |

Les autres modèles (brouillon, reçu POS, etc.) sont rarement vus : applique le même
bloc si tu veux, ou laisse le branding de l'étape 1 faire le travail.

## Bon à savoir
- Quelques clients anciens (vieux Outlook) ignorent le `<style>` : l'e-mail retombe
  alors sur le style clair Shopify avec ton logo + accent acide (étape 1). C'est propre
  dans tous les cas.
- Aperçu du rendu : `preview-order-confirmation.html` (ouvre-le dans un navigateur).
