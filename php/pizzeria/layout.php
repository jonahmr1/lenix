<?php
// call this at the top of every page:
// layout_start($title, $activeNav)

function layout_start($title, $active) {
    $pages = [
        'dashboard' => ['label' => 'Tableau de bord', 'icon' => '🏠', 'href' => BASE . '/index.php'],
        'pizzas'    => ['label' => 'Pizzas',           'icon' => '🍕', 'href' => BASE . '/pizzas/index.php'],
        'clients'   => ['label' => 'Clients',          'icon' => '👤', 'href' => BASE . '/clients/index.php'],
        'commandes' => ['label' => 'Commandes',        'icon' => '🧾', 'href' => BASE . '/commandes/index.php'],
        'factures'  => ['label' => 'Factures',         'icon' => '📄', 'href' => BASE . '/factures/index.php'],
    ];
    ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title) ?> — Mini Pizzeria</title>
    <link rel="stylesheet" href="/pizzeria/assets/style.css">
</head>
<body>
<div class="shell">
    <aside class="sidebar">
        <div class="sidebar-logo">
            <h1>🍕 Pizzeria</h1>
            <span>Administration</span>
        </div>
        <nav>
            <?php foreach ($pages as $key => $page): ?>
            <a href="<?= $page['href'] ?>" class="<?= $active === $key ? 'active' : '' ?>">
                <span class="icon"><?= $page['icon'] ?></span>
                <?= $page['label'] ?>
            </a>
            <?php endforeach; ?>
        </nav>
        <div class="sidebar-footer">
            <a href="<?= BASE ?>/logout.php">Déconnexion</a>
        </div>
    </aside>
    <main class="main">
    <?php
    $flash = getFlash();
    if ($flash): ?>
        <div class="flash <?= $flash['type'] ?>"><?= htmlspecialchars($flash['msg']) ?></div>
    <?php endif; ?>
    <?php
}

function layout_end() {
    echo '</main></div></body></html>';
}
