<?php
require_once __DIR__ . '/../config.php';
requireLogin();

$id = intval($_GET['id'] ?? 0);

$used = $pdo->prepare("SELECT COUNT(*) FROM commande WHERE client_id=?");
$used->execute([$id]);
if ($used->fetchColumn() > 0) {
    flash("Ce client a des commandes, impossible de le supprimer.", "error");
    redirect('/clients/index.php');
}

$pdo->prepare("DELETE FROM client WHERE id=?")->execute([$id]);
flash("Client supprimé.");
redirect('/clients/index.php');
