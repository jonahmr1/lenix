<?php
// just reuse add.php with ?id=
$id = intval($_GET['id'] ?? 0);
header("Location: /clients/add.php?id=$id");
exit;
