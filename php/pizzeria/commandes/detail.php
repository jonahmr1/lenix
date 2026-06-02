<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

$id = intval($_GET['id'] ?? 0);

$stmt = $pdo->prepare("
    SELECT c.*, cl.nom, cl.prenom, cl.telephone
    FROM commande c
    JOIN client cl ON cl.id = c.client_id
    WHERE c.id = ?
");
$stmt->execute([$id]);
$commande = $stmt->fetch();
if (!$commande) redirect('/commandes/index.php');

$lignes = $pdo->prepare("
    SELECT dc.*, p.nom AS pizza_nom, p.taille
    FROM detail_commande dc
    JOIN pizza p ON p.id = dc.pizza_id
    WHERE dc.commande_id = ?
");
$lignes->execute([$id]);
$lignes = $lignes->fetchAll();

// handle status change
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['statut'])) {
    $s = $_POST['statut'];
    if (in_array($s, ['en_cours','terminee','annulee'])) {
        $pdo->prepare("UPDATE commande SET statut=? WHERE id=?")->execute([$s, $id]);
        flash("Statut mis à jour.");
        redirect("/commandes/detail.php?id=$id");
    }
}

$statuts = [
    'en_cours' => ['label' => 'En cours',  'badge' => 'badge-orange'],
    'terminee' => ['label' => 'Terminée',  'badge' => 'badge-green'],
    'annulee'  => ['label' => 'Annulée',   'badge' => 'badge-red'],
];

layout_start("Commande #$id", 'commandes');
?>

<div class="top-bar">
    <div class="page-header" style="margin:0">
        <h2>Commande <span style="color:var(--accent)">#<?= $id ?></span></h2>
        <p><a href="<?= BASE ?>/commandes/index.php" style="color:var(--muted);text-decoration:none;">← Retour</a></p>
    </div>
    <div style="display:flex;gap:10px;">
        <a href="<?= BASE ?>/factures/print.php?id=<?= $id ?>" target="_blank" class="btn btn-ghost">🖨 Imprimer la facture</a>
    </div>
</div>

<div style="display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start;">

    <div>
        <div class="card" style="margin-bottom:16px;">
            <h3 style="font-family:'Lora',serif;font-size:17px;margin-bottom:16px;">Détail de la commande</h3>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr><th>Pizza</th><th>Taille</th><th>Qté</th><th>P.U.</th><th>Sous-total</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($lignes as $l): ?>
                        <tr>
                            <td style="font-weight:500"><?= htmlspecialchars($l['pizza_nom']) ?></td>
                            <td><?= $l['taille'] ?></td>
                            <td><?= $l['quantite'] ?></td>
                            <td><?= number_format($l['prix_unitaire'], 0, ',', ' ') ?> DA</td>
                            <td style="font-weight:600"><?= number_format($l['prix_unitaire'] * $l['quantite'], 0, ',', ' ') ?> DA</td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <div style="text-align:right;margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
                <span style="color:var(--muted);font-size:13px;">Total</span>
                <strong style="font-size:24px;color:var(--accent);margin-left:16px;"><?= number_format($commande['total'], 0, ',', ' ') ?> DA</strong>
            </div>
        </div>
    </div>

    <div>
        <div class="card" style="margin-bottom:16px;">
            <h3 style="font-family:'Lora',serif;font-size:16px;margin-bottom:14px;">Client</h3>
            <p style="font-weight:600"><?= htmlspecialchars($commande['prenom'].' '.$commande['nom']) ?></p>
            <p style="color:var(--muted);font-size:13px;margin-top:4px;"><?= htmlspecialchars($commande['telephone']) ?></p>
            <p style="color:var(--muted);font-size:12px;margin-top:10px;"><?= date('d/m/Y à H:i', strtotime($commande['date_commande'])) ?></p>
        </div>

        <div class="card">
            <h3 style="font-family:'Lora',serif;font-size:16px;margin-bottom:14px;">Statut</h3>
            <span class="badge <?= $statuts[$commande['statut']]['badge'] ?>" style="margin-bottom:14px;display:inline-block;">
                <?= $statuts[$commande['statut']]['label'] ?>
            </span>
            <form method="POST" style="margin-top:10px;">
                <div class="form-group" style="margin-bottom:10px;">
                    <label>Changer le statut</label>
                    <select name="statut">
                        <?php foreach ($statuts as $k => $s): ?>
                            <option value="<?= $k ?>" <?= $commande['statut']===$k?'selected':'' ?>><?= $s['label'] ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-sm">Mettre à jour</button>
            </form>
        </div>
    </div>

</div>

<?php layout_end(); ?>
