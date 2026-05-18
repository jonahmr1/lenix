<?php
$conn = mysqli_connect("localhost", "root", "", "gestion_commandes");
if (!$conn) die("Erreur connexion : " . mysqli_connect_error());
mysqli_set_charset($conn, "utf8");
?>
