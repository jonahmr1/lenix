<?php
require 'config.php';
$action = $_GET['action'] ?? 'list';

if ($action == 'delete') {
    $id = (int)$_GET['id'];
    mysqli_query($conn, "DELETE FROM detail_commande WHERE ref_com=$id");
    mysqli_query($conn, "DELETE FROM commande WHERE ref_com=$id");
    header("Location: commandes.php"); exit;
}
if ($action == 'add' && $_POST) {
    $rc = (int)$_POST['ref_cli'];
    $dc = mysqli_real_escape_string($conn, $_POST['date_com']);
    $dl = mysqli_real_escape_string($conn, $_POST['date_liv']);
    mysqli_query($conn, "INSERT INTO commande (ref_cli,date_com,date_liv) VALUES ($rc,'$dc','$dl')");
    header("Location: commandes.php"); exit;
}
if ($action == 'edit' && $_POST) {
    $id = (int)$_POST['ref_com'];
    $rc = (int)$_POST['ref_cli'];
    $dc = mysqli_real_escape_string($conn, $_POST['date_com']);
    $dl = mysqli_real_escape_string($conn, $_POST['date_liv']);
    mysqli_query($conn, "UPDATE commande SET ref_cli=$rc,date_com='$dc',date_liv='$dl' WHERE ref_com=$id");
    header("Location: commandes.php"); exit;
}

function options_cli($conn, $sel=0) {
    $r = mysqli_query($conn, "SELECT ref_cli, description_cli FROM client");
    while ($row = mysqli_fetch_assoc($r))
        echo '<option value="'.$row['ref_cli'].'"'.($row['ref_cli']==$sel?' selected':'').'>'.htmlspecialchars($row['description_cli']).'</option>';
}
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Commandes</title></head>
<body>
<?php include 'nav.php'; ?>
<h2>Commandes</h2>

<?php if ($action == 'add'): ?>
  <h3>Ajouter une commande</h3>
  <form method="POST" action="commandes.php?action=add">
    Client : <select name="ref_cli"><?php options_cli($conn); ?></select><br><br>
    Date commande : <input type="date" name="date_com"><br><br>
    Date livraison : <input type="date" name="date_liv"><br><br>
    <input type="submit" value="Ajouter">
    <a href="commandes.php">Annuler</a>
  </form>

<?php elseif ($action == 'edit' && isset($_GET['id'])): ?>
  <?php $row = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM commande WHERE ref_com=" . (int)$_GET['id'])); ?>
  <h3>Modifier la commande</h3>
  <form method="POST" action="commandes.php?action=edit">
    <input type="hidden" name="ref_com" value="<?= $row['ref_com'] ?>">
    Client : <select name="ref_cli"><?php options_cli($conn, $row['ref_cli']); ?></select><br><br>
    Date commande : <input type="date" name="date_com" value="<?= $row['date_com'] ?>"><br><br>
    Date livraison : <input type="date" name="date_liv" value="<?= $row['date_liv'] ?>"><br><br>
    <input type="submit" value="Modifier">
    <a href="commandes.php">Annuler</a>
  </form>

<?php else: ?>
  <form method="GET" action="commandes.php">
    Recherche client : <input type="text" name="search" value="<?= htmlspecialchars($_GET['search'] ?? '') ?>">
    <input type="submit" value="Chercher">
  </form><br>
  <a href="commandes.php?action=add">+ Ajouter une commande</a><br><br>

  <?php
    $search = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';
    $where  = $search ? "WHERE cl.description_cli LIKE '%$search%'" : '';
    $res    = mysqli_query($conn, "SELECT c.*, cl.description_cli FROM commande c
                                   JOIN client cl ON c.ref_cli=cl.ref_cli $where ORDER BY c.date_com DESC");
  ?>
  <table border="1" cellpadding="5">
    <tr><th>Ref</th><th>Client</th><th>Date commande</th><th>Date livraison</th><th>Actions</th></tr>
    <?php while ($row = mysqli_fetch_assoc($res)): ?>
    <tr>
      <td><?= $row['ref_com'] ?></td>
      <td><?= htmlspecialchars($row['description_cli']) ?></td>
      <td><?= $row['date_com'] ?></td>
      <td><?= $row['date_liv'] ?></td>
      <td>
        <a href="commandes.php?action=edit&id=<?= $row['ref_com'] ?>">Modifier</a> |
        <a href="commandes.php?action=delete&id=<?= $row['ref_com'] ?>" onclick="return confirm('Supprimer cette commande et ses details ?')">Supprimer</a>
      </td>
    </tr>
    <?php endwhile; ?>
  </table>
<?php endif; ?>

</body></html>
