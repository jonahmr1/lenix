<?php
require_once __DIR__ . '/../config.php';
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
if (!$commande) die('Commande introuvable');

$lignes = $pdo->prepare("
    SELECT dc.*, p.nom AS pizza_nom, p.taille
    FROM detail_commande dc
    JOIN pizza p ON p.id = dc.pizza_id
    WHERE dc.commande_id = ?
");
$lignes->execute([$id]);
$lignes = $lignes->fetchAll();

$facNum = 'FAC-' . str_pad($id, 4, '0', STR_PAD_LEFT);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture <?= $facNum ?></title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Sora:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; font-size: 13px; color: #1a1410; background: #fff; }

        .page { max-width: 680px; margin: 0 auto; padding: 48px 40px; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #f0700a; }
        .header h1 { font-family: 'Lora', serif; font-size: 28px; color: #f0700a; }
        .header .meta { text-align: right; }
        .header .fac-num { font-size: 18px; font-weight: 600; color: #1a1410; }
        .header .fac-date { color: #888; font-size: 12px; margin-top: 4px; }

        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 36px; }
        .partie h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #888; margin-bottom: 8px; }
        .partie p { line-height: 1.7; font-size: 13.5px; }
        .partie strong { font-weight: 600; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead th { text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #888; background: #faf8f5; border-bottom: 1px solid #e8e0d5; }
        tbody td { padding: 12px; border-bottom: 1px solid #f0ebe4; font-size: 13.5px; vertical-align: middle; }
        tbody tr:last-child td { border-bottom: none; }

        .total-section { margin-left: auto; width: 260px; border-top: 2px solid #1a1410; padding-top: 16px; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .total-row.main { font-size: 18px; font-weight: 700; color: #f0700a; border-top: 1px solid #e8e0d5; margin-top: 8px; padding-top: 10px; }

        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e8e0d5; text-align: center; color: #aaa; font-size: 11.5px; }

        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
        }

        .btn-print {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 20px; background: #f0700a; color: #fff;
            border: none; border-radius: 8px; font-family: 'Sora', sans-serif;
            font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 30px;
        }
    </style>
</head>
<body>
<div class="page">
    <button class="btn-print no-print" onclick="window.print()">🖨 Imprimer</button>

    <div class="header">
        <div>
            <h1>🍕 Pizzeria</h1>
            <p style="color:#888;font-size:12px;margin-top:4px;">Administration</p>
        </div>
        <div class="meta">
            <div class="fac-num"><?= $facNum ?></div>
            <div class="fac-date"><?= date('d/m/Y', strtotime($commande['date_commande'])) ?></div>
        </div>
    </div>

    <div class="parties">
        <div class="partie">
            <h3>Émetteur</h3>
            <p>
                <strong>Mini Pizzeria</strong><br>
                Alger, Algérie<br>
                pizzeria@example.dz
            </p>
        </div>
        <div class="partie">
            <h3>Client</h3>
            <p>
                <strong><?= htmlspecialchars($commande['prenom'].' '.$commande['nom']) ?></strong><br>
                Tél : <?= htmlspecialchars($commande['telephone']) ?>
            </p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Désignation</th>
                <th>Taille</th>
                <th style="text-align:center">Qté</th>
                <th style="text-align:right">P.U.</th>
                <th style="text-align:right">Total</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($lignes as $l): ?>
            <tr>
                <td style="font-weight:500"><?= htmlspecialchars($l['pizza_nom']) ?></td>
                <td><?= $l['taille'] ?></td>
                <td style="text-align:center"><?= $l['quantite'] ?></td>
                <td style="text-align:right"><?= number_format($l['prix_unitaire'], 0, ',', ' ') ?> DA</td>
                <td style="text-align:right;font-weight:600"><?= number_format($l['prix_unitaire']*$l['quantite'], 0, ',', ' ') ?> DA</td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div style="display:flex;justify-content:flex-end;">
        <div class="total-section">
            <div class="total-row"><span>Sous-total HT</span><span><?= number_format($commande['total'], 0, ',', ' ') ?> DA</span></div>
            <div class="total-row"><span>TVA (0%)</span><span>—</span></div>
            <div class="total-row main"><span>Total TTC</span><span><?= number_format($commande['total'], 0, ',', ' ') ?> DA</span></div>
        </div>
    </div>

    <div class="footer">
        Merci pour votre commande ! &nbsp;•&nbsp; Mini Pizzeria — Alger
    </div>
</div>
</body>
</html>
