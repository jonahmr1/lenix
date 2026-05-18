<?php
require 'config.php';
$action = $_GET['action'] ?? 'list';

if ($action == 'delete') {
    mysqli_query($conn, "DELETE FROM fournisseur WHERE ref_f=" . (int)$_GET['id']);
    header("Location: fournisseurs.php"); exit;
}
if ($action == 'add' && $_POST) {
    $d = mysqli_real_escape_string($conn, $_POST['description_f']);
    $v = mysqli_real_escape_string($conn, $_POST['ville_f']);
    $t = mysqli_real_escape_string($conn, $_POST['tel_f']);
    mysqli_query($conn, "INSERT INTO fournisseur (description_f,ville_f,tel_f) VALUES ('$d','$v','$t')");
    header("Location: fournisseurs.php"); exit;
}
if ($action == 'edit' && $_POST) {
    $id = (int)$_POST['ref_f'];
    $d  = mysqli_real_escape_string($conn, $_POST['description_f']);
    $v  = mysqli_real_escape_string($conn, $_POST['ville_f']);
    $t  = mysqli_real_escape_string($conn, $_POST['tel_f']);
    mysqli_query($conn, "UPDATE fournisseur SET description_f='$d',ville_f='$v',tel_f='$t' WHERE ref_f=$id");
    header("Location: fournisseurs.php"); exit;
}
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Fournisseurs</title></head>
<body>
<?php include 'nav.php'; ?>
<h2>Fournisseurs</h2>

<?php if ($action == 'add'): ?>
  <h3>Ajouter un fournisseur</h3>
  <form method="POST" action="fournisseurs.php?action=add">
    Description : <input type="text" name="description_f"><br><br>
    Ville : <input type="text" name="ville_f"><br><br>
    Tel : <input type="text" name="tel_f"><br><br>
    <input type="submit" value="Ajouter">
    <a href="fournisseurs.php">Annuler</a>
  </form>

<?php elseif ($action == 'edit' && isset($_GET['id'])): ?>
  <?php $row = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM fournisseur WHERE ref_f=" . (int)$_GET['id'])); ?>
  <h3>Modifier le fournisseur</h3>
  <form method="POST" action="fournisseurs.php?action=edit">
    <input type="hidden" name="ref_f" value="<?= $row['ref_f'] ?>">
    Description : <input type="text" name="description_f" value="<?= htmlspecialchars($row['description_f']) ?>"><br><br>
    Ville : <input type="text" name="ville_f" value="<?= htmlspecialchars($row['ville_f']) ?>"><br><br>
    Tel : <input type="text" name="tel_f" value="<?= htmlspecialchars($row['tel_f']) ?>"><br><br>
    <input type="submit" value="Modifier">
    <a href="fournisseurs.php">Annuler</a>
  </form>

<?php else: ?>
  <form method="GET" action="fournisseurs.php">
    Recherche : <input type="text" name="search" value="<?= htmlspecialchars($_GET['search'] ?? '') ?>">
    <input type="submit" value="Chercher">
  </form><br>
  <a href="fournisseurs.php?action=add">+ Ajouter un fournisseur</a><br><br>

  <?php
    $search = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';
    $where  = $search ? "WHERE description_f LIKE '%$search%'" : '';
    $res    = mysqli_query($conn, "SELECT * FROM fournisseur $where");
  ?>
  <table border="1" cellpadding="5">
    <tr><th>Ref</th><th>Description</th><th>Ville</th><th>Tel</th><th>Actions</th></tr>
    <?php while ($row = mysqli_fetch_assoc($res)): ?>
    <tr>
      <td><?= $row['ref_f'] ?></td>
      <td><?= htmlspecialchars($row['description_f']) ?></td>
      <td><?= htmlspecialchars($row['ville_f']) ?></td>
      <td><?= htmlspecialchars($row['tel_f']) ?></td>
      <td>
        <a href="fournisseurs.php?action=edit&id=<?= $row['ref_f'] ?>">Modifier</a> |
        <a href="fournisseurs.php?action=delete&id=<?= $row['ref_f'] ?>" onclick="return confirm('Supprimer ?')">Supprimer</a>
      </td>
    </tr>
    <?php endwhile; ?>
  </table>
<?php endif; ?>

</body></html>
