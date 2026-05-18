<?php
require 'config.php';
$action = $_GET['action'] ?? 'list';

// Supprimer
if ($action == 'delete') {
    $id = (int)$_GET['id'];
    mysqli_query($conn, "DELETE FROM client WHERE ref_cli=$id");
    header("Location: clients.php"); exit;
}

// Ajouter
if ($action == 'add' && $_POST) {
    $d = mysqli_real_escape_string($conn, $_POST['description_cli']);
    $c = mysqli_real_escape_string($conn, $_POST['contact_cli']);
    $v = mysqli_real_escape_string($conn, $_POST['ville_cli']);
    $t = mysqli_real_escape_string($conn, $_POST['tel_cli']);
    mysqli_query($conn, "INSERT INTO client (description_cli,contact_cli,ville_cli,tel_cli) VALUES ('$d','$c','$v','$t')");
    header("Location: clients.php"); exit;
}

// Modifier
if ($action == 'edit' && $_POST) {
    $id = (int)$_POST['ref_cli'];
    $d  = mysqli_real_escape_string($conn, $_POST['description_cli']);
    $c  = mysqli_real_escape_string($conn, $_POST['contact_cli']);
    $v  = mysqli_real_escape_string($conn, $_POST['ville_cli']);
    $t  = mysqli_real_escape_string($conn, $_POST['tel_cli']);
    mysqli_query($conn, "UPDATE client SET description_cli='$d',contact_cli='$c',ville_cli='$v',tel_cli='$t' WHERE ref_cli=$id");
    header("Location: clients.php"); exit;
}
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Clients</title></head>
<body>
<?php include 'nav.php'; ?>
<h2>Clients</h2>

<?php if ($action == 'add'): ?>
  <h3>Ajouter un client</h3>
  <form method="POST" action="clients.php?action=add">
    Description : <input type="text" name="description_cli"><br><br>
    Contact : <input type="text" name="contact_cli"><br><br>
    Ville : <input type="text" name="ville_cli"><br><br>
    Tel : <input type="text" name="tel_cli"><br><br>
    <input type="submit" value="Ajouter">
    <a href="clients.php">Annuler</a>
  </form>

<?php elseif ($action == 'edit' && isset($_GET['id'])): ?>
  <?php
    $id  = (int)$_GET['id'];
    $row = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM client WHERE ref_cli=$id"));
  ?>
  <h3>Modifier le client</h3>
  <form method="POST" action="clients.php?action=edit">
    <input type="hidden" name="ref_cli" value="<?= $row['ref_cli'] ?>">
    Description : <input type="text" name="description_cli" value="<?= htmlspecialchars($row['description_cli']) ?>"><br><br>
    Contact : <input type="text" name="contact_cli" value="<?= htmlspecialchars($row['contact_cli']) ?>"><br><br>
    Ville : <input type="text" name="ville_cli" value="<?= htmlspecialchars($row['ville_cli']) ?>"><br><br>
    Tel : <input type="text" name="tel_cli" value="<?= htmlspecialchars($row['tel_cli']) ?>"><br><br>
    <input type="submit" value="Modifier">
    <a href="clients.php">Annuler</a>
  </form>

<?php else: ?>
  <!-- Recherche -->
  <form method="GET" action="clients.php">
    Recherche : <input type="text" name="search" value="<?= htmlspecialchars($_GET['search'] ?? '') ?>">
    <input type="submit" value="Chercher">
  </form><br>

  <a href="clients.php?action=add">+ Ajouter un client</a><br><br>

  <?php
    $search = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';
    $where  = $search ? "WHERE description_cli LIKE '%$search%' OR ville_cli LIKE '%$search%'" : '';
    $res    = mysqli_query($conn, "SELECT * FROM client $where");
  ?>

  <table border="1" cellpadding="5">
    <tr>
      <th>Ref</th><th>Description</th><th>Contact</th><th>Ville</th><th>Tel</th><th>Actions</th>
    </tr>
    <?php while ($row = mysqli_fetch_assoc($res)): ?>
    <tr>
      <td><?= $row['ref_cli'] ?></td>
      <td><?= htmlspecialchars($row['description_cli']) ?></td>
      <td><?= htmlspecialchars($row['contact_cli']) ?></td>
      <td><?= htmlspecialchars($row['ville_cli']) ?></td>
      <td><?= htmlspecialchars($row['tel_cli']) ?></td>
      <td>
        <a href="clients.php?action=edit&id=<?= $row['ref_cli'] ?>">Modifier</a> |
        <a href="clients.php?action=delete&id=<?= $row['ref_cli'] ?>" onclick="return confirm('Supprimer ?')">Supprimer</a>
      </td>
    </tr>
    <?php endwhile; ?>
  </table>
<?php endif; ?>

</body></html>
