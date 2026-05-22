<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

// optional search
$search = trim($_GET['q'] ?? '');
if ($search) {
    $stmt = $pdo->prepare("SELECT * FROM client WHERE nom LIKE ? OR prenom LIKE ? OR telephone LIKE ? ORDER BY nom");
    $like = "%$search%";
    $stmt->execute([$like, $like, $like]);
} else {
    $stmt = $pdo->query("SELECT * FROM client ORDER BY nom");
}
$clients = $stmt->fetchAll();

layout_start('Clients', 'clients');
?>

<div class="top-bar">
    <div class="page-header" style="margin:0">
        <h2>Clients</h2>
        <p><?= count($clients) ?> client(s) trouvé(s)</p>
    </div>
    <div style="display:flex;gap:10px;">
        <form method="GET" style="display:flex;gap:8px;">
            <input type="text" name="q" placeholder="Rechercher…" value="<?= htmlspecialchars($search) ?>"
                   style="background:#141312;border:1px solid var(--border);border-radius:8px;padding:8px 14px;color:var(--text);font-family:inherit;outline:none;width:200px">
            <button type="submit" class="btn btn-ghost">🔍</button>
        </form>
        <a href="<?= BASE ?>/clients/add.php" class="btn btn-primary">+ Ajouter</a>
    </div>
</div>

<div class="card">
    <?php if (empty($clients)): ?>
        <div class="empty">
            <div class="icon">👤</div>
            <p>Aucun client trouvé.</p>
        </div>
    <?php else: ?>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nom complet</th>
                    <th>Téléphone</th>
                    <th>Commandes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($clients as $c): ?>
                <?php
                    $nb = $pdo->prepare("SELECT COUNT(*) FROM commande WHERE client_id=?");
                    $nb->execute([$c['id']]);
                    $nbCmd = $nb->fetchColumn();
                ?>
                <tr>
                    <td style="color:var(--muted)"><?= $c['id'] ?></td>
                    <td style="font-weight:500"><?= htmlspecialchars($c['prenom'] . ' ' . $c['nom']) ?></td>
                    <td><?= htmlspecialchars($c['telephone']) ?></td>
                    <td><?= $nbCmd ?></td>
                    <td>
                        <div class="actions">
                            <a href="<?= BASE ?>/clients/edit.php?id=<?= $c['id'] ?>" class="btn btn-ghost btn-sm">Modifier</a>
                            <a href="<?= BASE ?>/clients/delete.php?id=<?= $c['id'] ?>"
                               class="btn btn-danger btn-sm"
                               onclick="return confirm('Supprimer ce client ?')">Supprimer</a>
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
