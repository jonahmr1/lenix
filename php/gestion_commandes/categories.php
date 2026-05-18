<?php
require 'config.php';
$action = $_GET['action'] ?? 'list';

if ($action == 'delete') {
    mysqli_query($conn, "DELETE FROM categorie WHERE ref_cat=" . (int)$_GET['id']);
    header("Location: categories.php"); exit;
}
if ($action == 'add' && $_POST) {
    $d = mysqli_real_escape_string($conn, $_POST['description_cat']);
    mysqli_query($conn, "INSERT INTO categorie (description_cat) VALUES ('$d')");
    header("Location: categories.php"); exit;
}
if ($action == 'edit' && $_POST) {
    $id = (int)$_POST['ref_cat'];
    $d  = mysqli_real_escape_string($conn, $_POST['description_cat']);
    mysqli_query($conn, "UPDATE categorie SET description_cat='$d' WHERE ref_cat=$id");
    header("Location: categories.php"); exit;
}
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Categories</title></head>
<body>
<?php include 'nav.php'; ?>
<h2>Categories</h2>

<?php if ($action == 'add'): ?>
  <h3>Ajouter une categorie</h3>
  <form method="POST" action="categories.php?action=add">
    Description : <input type="text" name="description_cat"><br><br>
    <input type="submit" value="Ajouter">
    <a href="categories.php">Annuler</a>
  </form>

<?php elseif ($action == 'edit' && isset($_GET['id'])): ?>
  <?php $row = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM categorie WHERE ref_cat=" . (int)$_GET['id'])); ?>
  <h3>Modifier la categorie</h3>
  <form method="POST" action="categories.php?action=edit">
    <input type="hidden" name="ref_cat" value="<?= $row['ref_cat'] ?>">
    Description : <input type="text" name="description_cat" value="<?= htmlspecialchars($row['description_cat']) ?>"><br><br>
    <input type="submit" value="Modifier">
    <a href="categories.php">Annuler</a>
  </form>

<?php else: ?>
  <form method="GET" action="categories.php">
    Recherche : <input type="text" name="search" value="<?= htmlspecialchars($_GET['search'] ?? '') ?>">
    <input type="submit" value="Chercher">
  </form><br>
  <a href="categories.php?action=add">+ Ajouter une categorie</a><br><br>

  <?php
    $search = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';
    $where  = $search ? "WHERE description_cat LIKE '%$search%'" : '';
    $res    = mysqli_query($conn, "SELECT * FROM categorie $where");
  ?>
  <table border="1" cellpadding="5">
    <tr><th>Ref</th><th>Description</th><th>Actions</th></tr>
    <?php while ($row = mysqli_fetch_assoc($res)): ?>
    <tr>
      <td><?= $row['ref_cat'] ?></td>
      <td><?= htmlspecialchars($row['description_cat']) ?></td>
      <td>
        <a href="categories.php?action=edit&id=<?= $row['ref_cat'] ?>">Modifier</a> |
        <a href="categories.php?action=delete&id=<?= $row['ref_cat'] ?>" onclick="return confirm('Supprimer ?')">Supprimer</a>
      </td>
    </tr>
    <?php endwhile; ?>
  </table>
<?php endif; ?>

</body></html>
