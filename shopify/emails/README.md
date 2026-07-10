# E-mails Shopify aux couleurs SORI

Six e-mails automatiques **entièrement personnalisés** (noir + jaune acide, ton SORI),
prêts à coller dans l'admin Shopify. Chaque fichier remplace TOUT le code du modèle
correspondant — les variables `{{ ... }}` (montants, articles, suivi, liens sécurisés)
sont déjà en place.

## Les 6 modèles

| Fichier | Modèle Shopify (Réglages → Notifications) | Objet suggéré |
|---|---|---|
| `confirmation-commande.html` | **Confirmation de commande** | `SORI® — Commande {{ name }} confirmée` |
| `confirmation-expedition.html` | **Confirmation d'expédition** | `SORI® — Ta commande {{ name }} est en route` |
| `facture-commande.html` | **Facture de la commande** | `SORI® — Facture {{ name }}` |
| `commande-annulee.html` | **Commande annulée** | `SORI® — Commande {{ name }} annulée` |
| `bienvenue-compte.html` | **Bienvenue du compte client** (ou « Confirmation du compte client ») | `Bienvenue chez SORI® — ton compte est prêt` |
| `reinitialisation-mdp.html` | **Réinitialisation du mot de passe client** | `SORI® — Réinitialise ton mot de passe` |

## Installation (2 min par e-mail)

1. **Admin Shopify → Réglages → Notifications** (section « Notifications aux clients »)
2. Clique le modèle (ex. « Confirmation de commande »)
3. Bouton **« Modifier le code »**
4. **Sélectionne tout le code existant** (Ctrl/Cmd+A) et **remplace-le** par le contenu
   du fichier correspondant de ce dossier
5. Remplace aussi l'**objet** de l'e-mail par l'objet suggéré du tableau
6. Clique **« Aperçu »** pour vérifier, puis **Enregistrer**

> 💡 En cas de doute, Shopify garde un bouton **« Rétablir la valeur par défaut »**
> sur chaque modèle : tu peux toujours revenir en arrière. Zéro risque.

## À savoir

- **`bienvenue-compte.html`** : le bouton « Accéder à mon compte » pointe vers la page
  compte DU SITE : `https://soriwear.ch/compte/`.
- **`reinitialisation-mdp.html`** : ne touche jamais à `{{ customer.reset_password_url }}` —
  c'est le lien sécurisé généré par Shopify.
- **`facture-commande.html`** : cet e-mail part quand tu envoies une facture depuis une
  commande provisoire (Commandes → Commandes provisoires → Envoyer la facture).
- Les e-mails sont sombres par design. Quelques très vieux clients mail (anciens Outlook)
  simplifient le rendu, mais le contenu et les liens restent parfaitement lisibles.
- Aperçu local : ouvre `preview-order-confirmation.html` dans un navigateur pour voir le
  rendu de la confirmation de commande avec des données d'exemple.

## Branding global (à faire une fois, en complément)

**Réglages → Notifications → « Personnaliser »** : ajoute le logo SORI et la couleur
d'accentuation `#D8F000`. Ça couvre les e-mails que tu n'as pas personnalisés
(sortie pour livraison, remboursement, etc.).

## L'ancien « skin » (`sori-notification-style.html`)

Conservé pour référence : c'était la V1 (un bloc CSS à coller dans les modèles d'origine).
Les 6 modèles complets ci-dessus le remplacent avantageusement — utilise le skin seulement
pour les notifications secondaires que tu veux assombrir sans les réécrire.
