<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/layout.php';
requireLogin();

// quick stats
$nbPizzas    = $pdo->query("SELECT COUNT(*) FROM pizza WHERE disponible=1")->fetchColumn();
$nbClients   = $pdo->query("SELECT COUNT(*) FROM client")->fetchColumn();
$nbCommandes = $pdo->query("SELECT COUNT(*) FROM commande WHERE DATE(date_commande)=CURDATE()")->fetchColumn();
$caJour      = $pdo->query("SELECT COALESCE(SUM(total),0) FROM commande WHERE DATE(date_commande)=CURDATE() AND statut='terminee'")->fetchColumn();
$caTotal     = $pdo->query("SELECT COALESCE(SUM(total),0) FROM commande WHERE statut='terminee'")->fetchColumn();

// last 6 orders
$dernieres = $pdo->query("
    SELECT c.id, c.date_commande, c.total, c.statut,
           cl.nom, cl.prenom
    FROM commande c
    JOIN client cl ON cl.id = c.client_id
    ORDER BY c.date_commande DESC
    LIMIT 6
")->fetchAll();

$statuts = [
    'en_cours' => ['label' => 'En cours',  'badge' => 'badge-orange'],
    'terminee' => ['label' => 'Terminée',  'badge' => 'badge-green'],
    'annulee'  => ['label' => 'Annulée',   'badge' => 'badge-red'],
];

layout_start('Tableau de bord', 'dashboard');
?>

<div class="page-header">
    <h2>Bonjour </h2>
    <p>Voici un résumé de l'activité d'aujourd'hui.</p>
</div>

<div class="stat-grid">
    <div class="stat-card">
        <div class="label">Pizzas disponibles</div>
        <div class="value orange"><?= $nbPizzas ?></div>
    </div>
    <div class="stat-card">
        <div class="label">Clients enregistrés</div>
        <div class="value"><?= $nbClients ?></div>
    </div>
    <div class="stat-card">
        <div class="label">Commandes aujourd'hui</div>
        <div class="value"><?= $nbCommandes ?></div>
    </div>
    <div class="stat-card">
        <div class="label">CA du jour</div>
        <div class="value orange"><?= number_format($caJour, 0, ',', ' ') ?> DA</div>
    </div>
    <div class="stat-card">
        <div class="label">CA total</div>
        <div class="value"><?= number_format($caTotal, 0, ',', ' ') ?> DA</div>
    </div>
</div>

<div class="top-bar">
    <h3 style="font-family:'Lora',serif;font-size:18px;">Dernières commandes</h3>
    <a href="<?= BASE ?>/commandes/new.php" class="btn btn-primary">+ Nouvelle commande</a>
</div>

<div class="card">
    <?php if (empty($dernieres)): ?>
        <div class="empty">
            <div class="icon"></div>
            <p>Aucune commande pour l'instant.</p>
        </div>
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($dernieres as $c): ?>
                <tr>
                    <td style="color:var(--muted)">#<?= $c['id'] ?></td>
                    <td><?= htmlspecialchars($c['prenom'] . ' ' . $c['nom']) ?></td>
                    <td><?= date('d/m/Y H:i', strtotime($c['date_commande'])) ?></td>
                    <td style="font-weight:600"><?= number_format($c['total'], 0, ',', ' ') ?> DA</td>
                    <td>
                        <span class="badge <?= $statuts[$c['statut']]['badge'] ?>">
                            <?= $statuts[$c['statut']]['label'] ?>
                        </span>
                    </td>
                    <td>
                        <a href="<?= BASE ?>/commandes/detail.php?id=<?= $c['id'] ?>" class="btn btn-ghost btn-sm">Voir</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>

<?php layout_end(); ?>
