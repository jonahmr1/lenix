<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

$id = intval($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT * FROM pizza WHERE id=?");
$stmt->execute([$id]);
$pizza = $stmt->fetch();
if (!$pizza) redirect('/pizzas/index.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom    = trim($_POST['nom'] ?? '');
    $taille = $_POST['taille'] ?? 'Moyenne';
    $prix   = floatval($_POST['prix'] ?? 0);
    $dispo  = isset($_POST['disponible']) ? 1 : 0;

    if ($nom && $prix > 0) {
        $stmt = $pdo->prepare("UPDATE pizza SET nom=?,taille=?,prix=?,disponible=? WHERE id=?");
        $stmt->execute([$nom, $taille, $prix, $dispo, $id]);
        flash("Pizza mise à jour !");
        redirect('/pizzas/index.php');
    } else {
        $error = "Nom et prix sont obligatoires.";
    }
}

// pre-fill from DB on first load
$_POST = $_POST ?: $pizza;

layout_start('Modifier une pizza', 'pizzas');
?>

<div class="page-header">
    <h2>Modifier : <?= htmlspecialchars($pizza['nom']) ?></h2>
    <p><a href="<?= BASE ?>/pizzas/index.php" style="color:var(--muted);text-decoration:none;">← Retour</a></p>
</div>

<?php if (!empty($error)): ?>
    <div class="flash error"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<div class="card" style="max-width:480px">
    <form method="POST">
        <div class="form-group">
            <label>Nom de la pizza</label>
            <input type="text" name="nom" value="<?= htmlspecialchars($_POST['nom'] ?? '') ?>" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Taille</label>
                <select name="taille">
                    <?php foreach (['Petite','Moyenne','Grande'] as $t): ?>
                        <option value="<?= $t ?>" <?= ($_POST['taille'] ?? '') === $t ? 'selected' : '' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label>Prix (DA)</label>
                <input type="number" name="prix" min="1" step="50" value="<?= htmlspecialchars($_POST['prix'] ?? '') ?>" required>
            </div>
        </div>
        <div class="form-group" style="display:flex;align-items:center;gap:10px;margin-top:4px;">
            <input type="checkbox" name="disponible" id="dispo" value="1"
                   <?= ($_POST['disponible'] ?? 0) ? 'checked' : '' ?> style="width:auto">
            <label for="dispo" style="text-transform:none;font-size:14px;color:var(--text);letter-spacing:0;margin:0">Disponible à la vente</label>
        </div>
        <div style="display:flex;gap:10px;margin-top:8px;">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
            <a href="<?= BASE ?>/pizzas/index.php" class="btn btn-ghost">Annuler</a>
        </div>
    </form>
</div>

<?php layout_end(); ?>
