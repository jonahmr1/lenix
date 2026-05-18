<?php
require 'config.php';
$action = $_GET['action'] ?? 'list';

if ($action == 'delete') {
    mysqli_query($conn, "DELETE FROM produit WHERE ref_prod=" . (int)$_GET['id']);
    header("Location: produits.php"); exit;
}
if ($action == 'add' && $_POST) {
    $d  = mysqli_real_escape_string($conn, $_POST['description_prod']);
    $rf = (int)$_POST['ref_f'];
    $rc = (int)$_POST['ref_cat'];
    $p  = (float)$_POST['prixU'];
    $q  = (int)$_POST['qte_prod'];
    mysqli_query($conn, "INSERT INTO produit (description_prod,ref_f,ref_cat,prixU,qte_prod) VALUES ('$d',$rf,$rc,$p,$q)");
    header("Location: produits.php"); exit;
}
if ($action == 'edit' && $_POST) {
    $id = (int)$_POST['ref_prod'];
    $d  = mysqli_real_escape_string($conn, $_POST['description_prod']);
    $rf = (int)$_POST['ref_f'];
    $rc = (int)$_POST['ref_cat'];
    $p  = (float)$_POST['prixU'];
    $q  = (int)$_POST['qte_prod'];
    mysqli_query($conn, "UPDATE produit SET description_prod='$d',ref_f=$rf,ref_cat=$rc,prixU=$p,qte_prod=$q WHERE ref_prod=$id");
    header("Location: produits.php"); exit;
}

// Options fournisseur/categorie pour les selects
function options_f($conn, $sel=0) {
    $r = mysqli_query($conn, "SELECT ref_f, description_f FROM fournisseur");
    while ($row = mysqli_fetch_assoc($r))
        echo '<option value="'.$row['ref_f'].'"'.($row['ref_f']==$sel?' selected':'').'>'.htmlspecialchars($row['description_f']).'</option>';
}
function options_c($conn, $sel=0) {
    $r = mysqli_query($conn, "SELECT ref_cat, description_cat FROM categorie");
    while ($row = mysqli_fetch_assoc($r))
        echo '<option value="'.$row['ref_cat'].'"'.($row['ref_cat']==$sel?' selected':'').'>'.htmlspecialchars($row['description_cat']).'</option>';
}
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Produits</title></head>
<body>
<?php include 'nav.php'; ?>
<h2>Produits</h2>

<?php if ($action == 'add'): ?>
  <h3>Ajouter un produit</h3>
  <form method="POST" action="produits.php?action=add">
    Description : <input type="text" name="description_prod"><br><br>
    Fournisseur : <select name="ref_f"><?php options_f($conn); ?></select><br><br>
    Categorie : <select name="ref_cat"><?php options_c($conn); ?></select><br><br>
    Prix unitaire : <input type="number" step="0.01" name="prixU"><br><br>
    Quantite stock : <input type="number" name="qte_prod" value="0"><br><br>
    <input type="submit" value="Ajouter">
    <a href="produits.php">Annuler</a>
  </form>

<?php elseif ($action == 'edit' && isset($_GET['id'])): ?>
  <?php $row = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM produit WHERE ref_prod=" . (int)$_GET['id'])); ?>
  <h3>Modifier le produit</h3>
  <form method="POST" action="produits.php?action=edit">
    <input type="hidden" name="ref_prod" value="<?= $row['ref_prod'] ?>">
    Description : <input type="text" name="description_prod" value="<?= htmlspecialchars($row['description_prod']) ?>"><br><br>
    Fournisseur : <select name="ref_f"><?php options_f($conn, $row['ref_f']); ?></select><br><br>
    Categorie : <select name="ref_cat"><?php options_c($conn, $row['ref_cat']); ?></select><br><br>
    Prix unitaire : <input type="number" step="0.01" name="prixU" value="<?= $row['prixU'] ?>"><br><br>
    Quantite stock : <input type="number" name="qte_prod" value="<?= $row['qte_prod'] ?>"><br><br>
    <input type="submit" value="Modifier">
    <a href="produits.php">Annuler</a>
  </form>

<?php else: ?>
  <form method="GET" action="produits.php">
    Recherche : <input type="text" name="search" value="<?= htmlspecialchars($_GET['search'] ?? '') ?>">
    <input type="submit" value="Chercher">
  </form><br>
  <a href="produits.php?action=add">+ Ajouter un produit</a><br><br>

  <?php
    $search = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';
    $where  = $search ? "WHERE p.description_prod LIKE '%$search%'" : '';
    $res    = mysqli_query($conn, "SELECT p.*, f.description_f, c.description_cat
                                   FROM produit p
                                   JOIN fournisseur f ON p.ref_f=f.ref_f
                                   JOIN categorie c ON p.ref_cat=c.ref_cat $where");
  ?>
  <table border="1" cellpadding="5">
    <tr><th>Ref</th><th>Description</th><th>Fournisseur</th><th>Categorie</th><th>Prix</th><th>Qte</th><th>Actions</th></tr>
    <?php while ($row = mysqli_fetch_assoc($res)): ?>
    <tr>
      <td><?= $row['ref_prod'] ?></td>
      <td><?= htmlspecialchars($row['description_prod']) ?></td>
      <td><?= htmlspecialchars($row['description_f']) ?></td>
      <td><?= htmlspecialchars($row['description_cat']) ?></td>
      <td><?= $row['prixU'] ?> DA</td>
      <td><?= $row['qte_prod'] ?></td>
      <td>
        <a href="produits.php?action=edit&id=<?= $row['ref_prod'] ?>">Modifier</a> |
        <a href="produits.php?action=delete&id=<?= $row['ref_prod'] ?>" onclick="return confirm('Supprimer ?')">Supprimer</a>
      </td>
    </tr>
    <?php endwhile; ?>
  </table>
<?php endif; ?>

</body></html>
