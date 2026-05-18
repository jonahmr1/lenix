<?php
require 'config.php';
$action = $_GET['action'] ?? 'list';

if ($action == 'delete') {
    $com  = (int)$_GET['com'];
    $prod = (int)$_GET['prod'];
    mysqli_query($conn, "DELETE FROM detail_commande WHERE ref_com=$com AND ref_prod=$prod");
    header("Location: detail_commandes.php"); exit;
}
if ($action == 'add' && $_POST) {
    $rc = (int)$_POST['ref_com'];
    $rp = (int)$_POST['ref_prod'];
    $q  = (int)$_POST['qte_cde'];
    mysqli_query($conn, "INSERT INTO detail_commande (ref_com,ref_prod,qte_cde) VALUES ($rc,$rp,$q)");
    header("Location: detail_commandes.php"); exit;
}
if ($action == 'edit' && $_POST) {
    $rc = (int)$_POST['ref_com'];
    $rp = (int)$_POST['ref_prod'];
    $q  = (int)$_POST['qte_cde'];
    mysqli_query($conn, "UPDATE detail_commande SET qte_cde=$q WHERE ref_com=$rc AND ref_prod=$rp");
    header("Location: detail_commandes.php"); exit;
}

function options_com($conn, $sel=0) {
    $r = mysqli_query($conn, "SELECT ref_com, date_com FROM commande");
    while ($row = mysqli_fetch_assoc($r))
        echo '<option value="'.$row['ref_com'].'"'.($row['ref_com']==$sel?' selected':'').'>Commande N°'.$row['ref_com'].' - '.$row['date_com'].'</option>';
}
function options_prod($conn, $sel=0) {
    $r = mysqli_query($conn, "SELECT ref_prod, description_prod FROM produit");
    while ($row = mysqli_fetch_assoc($r))
        echo '<option value="'.$row['ref_prod'].'"'.($row['ref_prod']==$sel?' selected':'').'>'.htmlspecialchars($row['description_prod']).'</option>';
}
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Detail Commandes</title></head>
<body>
<?php include 'nav.php'; ?>
<h2>Detail Commandes</h2>

<?php if ($action == 'add'): ?>
  <h3>Ajouter un detail</h3>
  <form method="POST" action="detail_commandes.php?action=add">
    Commande : <select name="ref_com"><?php options_com($conn); ?></select><br><br>
    Produit : <select name="ref_prod"><?php options_prod($conn); ?></select><br><br>
    Quantite : <input type="number" name="qte_cde" value="1" min="1"><br><br>
    <input type="submit" value="Ajouter">
    <a href="detail_commandes.php">Annuler</a>
  </form>

<?php elseif ($action == 'edit' && isset($_GET['com']) && isset($_GET['prod'])): ?>
  <?php
    $com  = (int)$_GET['com'];
    $prod = (int)$_GET['prod'];
    $row  = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM detail_commande WHERE ref_com=$com AND ref_prod=$prod"));
  ?>
  <h3>Modifier le detail</h3>
  <form method="POST" action="detail_commandes.php?action=edit">
    <input type="hidden" name="ref_com" value="<?= $row['ref_com'] ?>">
    <input type="hidden" name="ref_prod" value="<?= $row['ref_prod'] ?>">
    Commande N° : <?= $row['ref_com'] ?><br><br>
    Produit N° : <?= $row['ref_prod'] ?><br><br>
    Quantite : <input type="number" name="qte_cde" value="<?= $row['qte_cde'] ?>" min="1"><br><br>
    <input type="submit" value="Modifier">
    <a href="detail_commandes.php">Annuler</a>
  </form>

<?php else: ?>
  <a href="detail_commandes.php?action=add">+ Ajouter un detail</a><br><br>

  <?php
    $res = mysqli_query($conn, "SELECT dc.*, p.description_prod, cl.description_cli, c.date_com
                                FROM detail_commande dc
                                JOIN produit p ON dc.ref_prod=p.ref_prod
                                JOIN commande c ON dc.ref_com=c.ref_com
                                JOIN client cl ON c.ref_cli=cl.ref_cli
                                ORDER BY dc.ref_com");
  ?>
  <table border="1" cellpadding="5">
    <tr><th>N° Commande</th><th>Client</th><th>Date</th><th>Produit</th><th>Quantite</th><th>Actions</th></tr>
    <?php while ($row = mysqli_fetch_assoc($res)): ?>
    <tr>
      <td><?= $row['ref_com'] ?></td>
      <td><?= htmlspecialchars($row['description_cli']) ?></td>
      <td><?= $row['date_com'] ?></td>
      <td><?= htmlspecialchars($row['description_prod']) ?></td>
      <td><?= $row['qte_cde'] ?></td>
      <td>
        <a href="detail_commandes.php?action=edit&com=<?= $row['ref_com'] ?>&prod=<?= $row['ref_prod'] ?>">Modifier</a> |
        <a href="detail_commandes.php?action=delete&com=<?= $row['ref_com'] ?>&prod=<?= $row['ref_prod'] ?>" onclick="return confirm('Supprimer ?')">Supprimer</a>
      </td>
    </tr>
    <?php endwhile; ?>
  </table>
<?php endif; ?>

</body></html>
