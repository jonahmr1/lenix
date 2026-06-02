<?php
require_once __DIR__ . '/../config.php';
requireLogin();

$id = intval($_GET['id'] ?? 0);
// detail_commande rows deleted via CASCADE
$pdo->prepare("DELETE FROM commande WHERE id=?")->execute([$id]);
flash("Commande supprimée.");
redirect('/commandes/index.php');
