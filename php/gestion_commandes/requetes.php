<?php
require 'config.php';
$q = (int)($_GET['q'] ?? 0);

$queries = [
    1  => ['titre' => 'Commandes dont le delai de livraison est superieur a 15 jours',
           'sql'   => "SELECT ref_com, date_com, date_liv, DATEDIFF(date_liv, date_com) AS nb_jours FROM commande WHERE DATEDIFF(date_liv, date_com) > 15"],
    2  => ['titre' => 'Commandes avec produits, prix, quantites, date et client',
           'sql'   => "SELECT c.ref_com, cl.description_cli, c.date_com, p.description_prod, dc.qte_cde, p.prixU FROM commande c JOIN client cl ON c.ref_cli=cl.ref_cli JOIN detail_commande dc ON c.ref_com=dc.ref_com JOIN produit p ON dc.ref_prod=p.ref_prod"],
    3  => ['titre' => 'Categories dont la designation commence par la lettre V',
           'sql'   => "SELECT * FROM categorie WHERE description_cat LIKE 'v%'"],
    4  => ['titre' => 'Fournisseurs qui ne figurent pas dans la table produit',
           'sql'   => "SELECT * FROM fournisseur WHERE ref_f NOT IN (SELECT ref_f FROM produit)"],
    5  => ['titre' => 'Quantite maximale et minimale commandee par produit',
           'sql'   => "SELECT p.description_prod, MAX(dc.qte_cde) AS qte_max, MIN(dc.qte_cde) AS qte_min FROM produit p JOIN detail_commande dc ON p.ref_prod=dc.ref_prod GROUP BY p.ref_prod, p.description_prod"],
    6  => ['titre' => 'Montant total par produit',
           'sql'   => "SELECT p.description_prod, SUM(dc.qte_cde * p.prixU) AS montant_total FROM produit p JOIN detail_commande dc ON p.ref_prod=dc.ref_prod GROUP BY p.ref_prod, p.description_prod"],
    7  => ['titre' => 'Clients ayant commande le produit N°1 (sous-requete)',
           'sql'   => "SELECT description_cli FROM client WHERE ref_cli IN (SELECT ref_cli FROM commande WHERE ref_com IN (SELECT ref_com FROM detail_commande WHERE ref_prod = 1))"],
    8  => ['titre' => 'Clients de la meme ville que le client Creche (sous-requete)',
           'sql'   => "SELECT description_cli, ville_cli FROM client WHERE ville_cli = (SELECT ville_cli FROM client WHERE description_cli = 'Creche') AND description_cli != 'Creche'"],
    9  => ['titre' => 'Nombre total de clients',
           'sql'   => "SELECT COUNT(*) AS nombre_total_clients FROM client"],
    10 => ['titre' => 'Nombre de clients ayant commande sans doublons',
           'sql'   => "SELECT COUNT(DISTINCT ref_cli) AS nombre_clients_ayant_commande FROM commande"],
    11 => ['titre' => 'Quantite totale commandee par reference de produit',
           'sql'   => "SELECT p.description_prod, dc.ref_prod, SUM(dc.qte_cde) AS qte_totale FROM detail_commande dc JOIN produit p ON dc.ref_prod=p.ref_prod GROUP BY dc.ref_prod, p.description_prod"],
    12 => ['titre' => 'Produits dont le prix moyen est inferieur a 200',
           'sql'   => "SELECT ref_prod, AVG(prixU) AS prix_moyen FROM produit GROUP BY ref_prod HAVING AVG(prixU) < 200"],
];
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Requetes</title></head>
<body>
<?php include 'nav.php'; ?>
<h2>Requetes SQL</h2>

<!-- Liens rapides -->
<?php for ($i = 1; $i <= 12; $i++): ?>
  <a href="requetes.php?q=<?= $i ?>">Requete <?= $i ?></a><?= $i < 12 ? ' | ' : '' ?>
<?php endfor; ?>

<hr>

<?php if ($q > 0 && isset($queries[$q])): ?>
  <h3>Requete <?= $q ?> : <?= htmlspecialchars($queries[$q]['titre']) ?></h3>
  <?php
    $res = mysqli_query($conn, $queries[$q]['sql']);
    if (!$res || mysqli_num_rows($res) == 0) {
        echo '<p>Aucun resultat.</p>';
    } else {
        echo '<table border="1" cellpadding="5"><tr>';
        $fields = mysqli_fetch_fields($res);
        foreach ($fields as $f) echo '<th>' . htmlspecialchars($f->name) . '</th>';
        echo '</tr>';
        while ($row = mysqli_fetch_assoc($res)) {
            echo '<tr>';
            foreach ($row as $val) echo '<td>' . htmlspecialchars($val ?? '') . '</td>';
            echo '</tr>';
        }
        echo '</table>';
    }
  ?>
<?php else: ?>
  <p>Selectionnez une requete dans le menu ci-dessus.</p>
<?php endif; ?>

</body></html>
