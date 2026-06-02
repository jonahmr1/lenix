<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

$client = null;
$id = intval($_GET['id'] ?? 0);
if ($id) {
    $stmt = $pdo->prepare("SELECT * FROM client WHERE id=?");
    $stmt->execute([$id]);
    $client = $stmt->fetch();
    if (!$client) redirect('/clients/index.php');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom      = trim($_POST['nom'] ?? '');
    $prenom   = trim($_POST['prenom'] ?? '');
    $tel      = trim($_POST['telephone'] ?? '');

    if ($nom && $prenom && $tel) {
        if ($client) {
            $pdo->prepare("UPDATE client SET nom=?,prenom=?,telephone=? WHERE id=?")
                ->execute([$nom, $prenom, $tel, $id]);
            flash("Client mis à jour !");
        } else {
            $pdo->prepare("INSERT INTO client (nom,prenom,telephone) VALUES (?,?,?)")
                ->execute([$nom, $prenom, $tel]);
            flash("Client ajouté !");
        }
        redirect('/clients/index.php');
    } else {
        $error = "Tous les champs sont obligatoires.";
    }
}

$title = $client ? "Modifier le client" : "Nouveau client";
if ($client && empty($_POST)) $_POST = $client;

layout_start($title, 'clients');
?>

<div class="page-header">
    <h2><?= $title ?></h2>
    <p><a href="<?= BASE ?>/clients/index.php" style="color:var(--muted);text-decoration:none;">← Retour</a></p>
</div>

<?php if (!empty($error)): ?>
    <div class="flash error"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<div class="card" style="max-width:480px">
    <form method="POST">
        <div class="form-row">
            <div class="form-group">
                <label>Prénom</label>
                <input type="text" name="prenom" value="<?= htmlspecialchars($_POST['prenom'] ?? '') ?>" required>
            </div>
            <div class="form-group">
                <label>Nom</label>
                <input type="text" name="nom" value="<?= htmlspecialchars($_POST['nom'] ?? '') ?>" required>
            </div>
        </div>
        <div class="form-group">
            <label>Téléphone</label>
            <input type="text" name="telephone" placeholder="0550000000" value="<?= htmlspecialchars($_POST['telephone'] ?? '') ?>" required>
        </div>
        <div style="display:flex;gap:10px;margin-top:8px;">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
            <a href="<?= BASE ?>/clients/index.php" class="btn btn-ghost">Annuler</a>
        </div>
    </form>
</div>

<?php layout_end(); ?>
