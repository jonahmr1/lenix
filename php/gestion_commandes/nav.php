<a href="index.php">Accueil</a> |
<select onchange="if(this.value) window.location=this.value">
  <option value="">-- Table --</option>
  <option value="clients.php">Clients</option>
  <option value="fournisseurs.php">Fournisseurs</option>
  <option value="categories.php">Categories</option>
  <option value="produits.php">Produits</option>
  <option value="commandes.php">Commandes</option>
  <option value="detail_commandes.php">Detail Commandes</option>
</select>

<select onchange="if(this.value) window.location=this.value">
  <option value="">-- Requete --</option>
  <option value="requetes.php?q=1">1. Commandes sup 15 jours</option>
  <option value="requetes.php?q=2">2. Commandes avec produits</option>
  <option value="requetes.php?q=3">3. Categories par V</option>
  <option value="requetes.php?q=4">4. Fournisseurs sans produit</option>
  <option value="requetes.php?q=5">5. Qte max/min</option>
  <option value="requetes.php?q=6">6. Montant total</option>
  <option value="requetes.php?q=7">7. Clients produit 1</option>
  <option value="requetes.php?q=8">8. Clients meme ville</option>
  <option value="requetes.php?q=9">9. Nb total clients</option>
  <option value="requetes.php?q=10">10. Clients distinct</option>
  <option value="requetes.php?q=11">11. Qte totale</option>
  <option value="requetes.php?q=12">12. Prix moyen inf 200</option>
</select>
<hr>
