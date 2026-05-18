<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Gestion Commandes</title></head>
<body>

<h2>Gestion des Commandes</h2>

<form>
  <select onchange="if(this.value) window.location=this.value">
    <option value="">-- Choisir une table --</option>
    <option value="clients.php">Clients</option>
    <option value="fournisseurs.php">Fournisseurs</option>
    <option value="categories.php">Categories</option>
    <option value="produits.php">Produits</option>
    <option value="commandes.php">Commandes</option>
    <option value="detail_commandes.php">Detail Commandes</option>
  </select>

  <select onchange="if(this.value) window.location=this.value">
    <option value="">-- Choisir une requete --</option>
    <option value="requetes.php?q=1">1. Commandes sup a 15 jours</option>
    <option value="requetes.php?q=2">2. Commandes avec produits</option>
    <option value="requetes.php?q=3">3. Categories commencant par V</option>
    <option value="requetes.php?q=4">4. Fournisseurs sans produit</option>
    <option value="requetes.php?q=5">5. Qte max/min par produit</option>
    <option value="requetes.php?q=6">6. Montant total par produit</option>
    <option value="requetes.php?q=7">7. Clients ayant commande produit 1</option>
    <option value="requetes.php?q=8">8. Clients meme ville que Creche</option>
    <option value="requetes.php?q=9">9. Nombre total de clients</option>
    <option value="requetes.php?q=10">10. Clients ayant commande distinct</option>
    <option value="requetes.php?q=11">11. Qte totale par produit</option>
    <option value="requetes.php?q=12">12. Produits prix moyen inf a 200</option>
  </select>
</form>

</body>
</html>
