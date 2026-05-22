<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

$pizzas = $pdo->query("SELECT * FROM pizza ORDER BY nom, taille")->fetchAll();
$tailles = ['Petite' => 'badge-gray', 'Moyenne' => 'badge-orange', 'Grande' => 'badge-green'];

layout_start('Pizzas', 'pizzas');
?>

<div class="top-bar">
    <div class="page-header" style="margin:0">
        <h2>Pizzas</h2>
        <p>Gérez votre carte</p>
    </div>
    <a href="<?= BASE ?>/pizzas/add.php" class="btn btn-primary">+ Ajouter une pizza</a>
</div>

<div class="card">
    <?php if (empty($pizzas)): ?>
        <div class="empty">
            <div class="icon">🍕</div>
            <p>Aucune pizza pour l'instant.</p>
        </div>
    <?php else: ?>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Taille</th>
                    <th>Prix</th>
                    <th>Dispo</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($pizzas as $p): ?>
                <tr>
                    <td style="color:var(--muted)"><?= $p['id'] ?></td>
                    <td style="font-weight:500"><?= htmlspecialchars($p['nom']) ?></td>
                    <td><span class="badge <?= $tailles[$p['taille']] ?>"><?= $p['taille'] ?></span></td>
                    <td><?= number_format($p['prix'], 0, ',', ' ') ?> DA</td>
                    <td>
                        <span class="badge <?= $p['disponible'] ? 'badge-green' : 'badge-red' ?>">
                            <?= $p['disponible'] ? 'Oui' : 'Non' ?>
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            <a href="<?= BASE ?>/pizzas/edit.php?id=<?= $p['id'] ?>" class="btn btn-ghost btn-sm">Modifier</a>
                            <a href="<?= BASE ?>/pizzas/delete.php?id=<?= $p['id'] ?>"
                               class="btn btn-danger btn-sm"
                               onclick="return confirm('Supprimer cette pizza ?')">Supprimer</a>
                        </div>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>

<?php layout_end(); ?>
