<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

// only terminated orders count as invoices
$factures = $pdo->query("
    SELECT c.id, c.date_commande, c.total,
           cl.nom, cl.prenom, cl.telephone
    FROM commande c
    JOIN client cl ON cl.id = c.client_id
    WHERE c.statut = 'terminee'
    ORDER BY c.date_commande DESC
")->fetchAll();

layout_start('Factures', 'factures');
?>

<div class="top-bar">
    <div class="page-header" style="margin:0">
        <h2>Factures</h2>
        <p><?= count($factures) ?> facture(s) émise(s)</p>
    </div>
</div>

<div class="card">
    <?php if (empty($factures)): ?>
        <div class="empty"><div class="icon">📄</div><p>Aucune facture pour l'instant.<br>Terminez des commandes pour les voir ici.</p></div>
    <?php else: ?>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>N° Facture</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($factures as $f): ?>
                <tr>
                    <td style="color:var(--accent);font-weight:600">FAC-<?= str_pad($f['id'], 4, '0', STR_PAD_LEFT) ?></td>
                    <td style="font-weight:500"><?= htmlspecialchars($f['prenom'].' '.$f['nom']) ?></td>
                    <td><?= date('d/m/Y', strtotime($f['date_commande'])) ?></td>
                    <td style="font-weight:600"><?= number_format($f['total'], 0, ',', ' ') ?> DA</td>
                    <td>
                        <a href="<?= BASE ?>/factures/print.php?id=<?= $f['id'] ?>" target="_blank" class="btn btn-ghost btn-sm">🖨 Imprimer</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>

<!-- Stats section -->
<?php
$stats = $pdo->query("SELECT * FROM vue_stats_pizza LIMIT 10")->fetchAll();
if ($stats):
?>
<div style="margin-top:24px;">
    <h3 style="font-family:'Lora',serif;font-size:18px;margin-bottom:16px;">Top ventes</h3>
    <div class="card">
        <div class="table-wrap">
            <table>
                <thead>
                    <tr><th>Pizza</th><th>Taille</th><th>Qté vendue</th><th>Chiffre d'affaires</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($stats as $s): ?>
                    <tr>
                        <td style="font-weight:500"><?= htmlspecialchars($s['nom']) ?></td>
                        <td><?= $s['taille'] ?></td>
                        <td><?= $s['total_vendues'] ?></td>
                        <td><?= number_format($s['chiffre_affaires'], 0, ',', ' ') ?> DA</td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?php endif; ?>

<?php layout_end(); ?>
