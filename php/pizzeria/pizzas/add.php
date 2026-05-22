<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom   = trim($_POST['nom'] ?? '');
    $taille = $_POST['taille'] ?? 'Moyenne';
    $prix  = floatval($_POST['prix'] ?? 0);
    $dispo = isset($_POST['disponible']) ? 1 : 0;

    if ($nom && $prix > 0) {
        $stmt = $pdo->prepare("INSERT INTO pizza (nom, taille, prix, disponible) VALUES (?,?,?,?)");
        $stmt->execute([$nom, $taille, $prix, $dispo]);
        flash("Pizza ajoutée avec succès !");
        redirect('/pizzas/index.php');
    } else {
        $error = "Nom et prix sont obligatoires.";
    }
}

layout_start('Ajouter une pizza', 'pizzas');
?>

<div class="page-header">
    <h2>Ajouter une pizza</h2>
    <p><a href="<?= BASE ?>/pizzas/index.php" style="color:var(--muted);text-decoration:none;">← Retour</a></p>
</div>

<?php if (!empty($error)): ?>
    <div class="flash error"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<div class="card" style="max-width:480px">
    <form method="POST">
        <div class="form-group">
            <label>Nom de la pizza</label>
            <input type="text" name="nom" placeholder="ex: Margherita" value="<?= htmlspecialchars($_POST['nom'] ?? '') ?>" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Taille</label>
                <select name="taille">
                    <?php foreach (['Petite','Moyenne','Grande'] as $t): ?>
                        <option value="<?= $t ?>" <?= ($_POST['taille'] ?? 'Moyenne') === $t ? 'selected' : '' ?>><?= $t ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label>Prix (DA)</label>
                <input type="number" name="prix" min="1" step="50" placeholder="1200" value="<?= htmlspecialchars($_POST['prix'] ?? '') ?>" required>
            </div>
        </div>
        <div class="form-group" style="display:flex;align-items:center;gap:10px;margin-top:4px;">
            <input type="checkbox" name="disponible" id="dispo" value="1" <?= !isset($_POST['nom']) || isset($_POST['disponible']) ? 'checked' : '' ?> style="width:auto">
            <label for="dispo" style="text-transform:none;font-size:14px;color:var(--text);letter-spacing:0;margin:0">Disponible à la vente</label>
        </div>
        <div style="display:flex;gap:10px;margin-top:8px;">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
            <a href="<?= BASE ?>/pizzas/index.php" class="btn btn-ghost">Annuler</a>
        </div>
    </form>
</div>

<?php layout_end(); ?>
