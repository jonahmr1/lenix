<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

$filtre = $_GET['statut'] ?? '';
$where  = $filtre ? "WHERE c.statut = ?" : '';
$params = $filtre ? [$filtre] : [];

$stmt = $pdo->prepare("
    SELECT c.*, cl.nom, cl.prenom
    FROM commande c
    JOIN client cl ON cl.id = c.client_id
    $where
    ORDER BY c.date_commande DESC
");
$stmt->execute($params);
$commandes = $stmt->fetchAll();

$statuts = [
    'en_cours' => ['label' => 'En cours',  'badge' => 'badge-orange'],
    'terminee' => ['label' => 'Terminée',  'badge' => 'badge-green'],
    'annulee'  => ['label' => 'Annulée',   'badge' => 'badge-red'],
];

layout_start('Commandes', 'commandes');
?>

<div class="top-bar">
    <div class="page-header" style="margin:0">
        <h2>Commandes</h2>
        <p><?= count($commandes) ?> commande(s)</p>
    </div>
    <div style="display:flex;gap:10px;align-items:center;">
        <select onchange="location='?statut='+this.value"
                style="background:#141312;border:1px solid var(--border);border-radius:8px;padding:8px 14px;color:var(--text);font-family:inherit;outline:none;">
            <option value="" <?= !$filtre ? 'selected':'' ?>>Toutes</option>
            <?php foreach ($statuts as $key => $s): ?>
                <option value="<?= $key ?>" <?= $filtre===$key?'selected':'' ?>><?= $s['label'] ?></option>
            <?php endforeach; ?>
        </select>
        <a href="<?= BASE ?>/commandes/new.php" class="btn btn-primary">+ Nouvelle</a>
    </div>
</div>

<div class="card">
    <?php if (empty($commandes)): ?>
        <div class="empty"><div class="icon">🧾</div><p>Aucune commande.</p></div>
    <?php else: ?>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($commandes as $c): ?>
                <tr>
                    <td style="color:var(--muted)">#<?= $c['id'] ?></td>
                    <td style="font-weight:500"><?= htmlspecialchars($c['prenom'].' '.$c['nom']) ?></td>
                    <td><?= date('d/m/Y H:i', strtotime($c['date_commande'])) ?></td>
                    <td style="font-weight:600"><?= number_format($c['total'], 0, ',', ' ') ?> DA</td>
                    <td><span class="badge <?= $statuts[$c['statut']]['badge'] ?>"><?= $statuts[$c['statut']]['label'] ?></span></td>
                    <td>
                        <div class="actions">
                            <a href="<?= BASE ?>/commandes/detail.php?id=<?= $c['id'] ?>" class="btn btn-ghost btn-sm">Détail</a>
                            <a href="<?= BASE ?>/factures/print.php?id=<?= $c['id'] ?>" target="_blank" class="btn btn-ghost btn-sm">🖨 Facture</a>
                            <a href="<?= BASE ?>/commandes/delete.php?id=<?= $c['id'] ?>"
                               class="btn btn-danger btn-sm"
                               onclick="return confirm('Supprimer cette commande ?')">✕</a>
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
