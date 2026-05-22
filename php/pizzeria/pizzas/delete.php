<?php
require_once __DIR__ . '/../config.php';
requireLogin();

$id = intval($_GET['id'] ?? 0);

// check if pizza is used in an order
$used = $pdo->prepare("SELECT COUNT(*) FROM detail_commande WHERE pizza_id=?");
$used->execute([$id]);
if ($used->fetchColumn() > 0) {
    flash("Impossible de supprimer : cette pizza est liée à des commandes.", "error");
    redirect('/pizzas/index.php');
}

$pdo->prepare("DELETE FROM pizza WHERE id=?")->execute([$id]);
flash("Pizza supprimée.");
redirect('/pizzas/index.php');
