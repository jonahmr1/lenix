<?php
require_once __DIR__ . '/config.php';

if (isLogged()) redirect('/index.php');

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $mdp   = trim($_POST['mot_de_passe'] ?? '');

    if ($email && $mdp) {
        $stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && $user['mot_de_passe'] === hash('sha256', $mdp)) {
            $_SESSION['admin_id']  = $user['id'];
            $_SESSION['admin_nom'] = $user['nom'];
            redirect('/index.php');
        } else {
            $error = "Email ou mot de passe incorrect.";
        }
    } else {
        $error = "Remplissez tous les champs.";
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion — Mini Pizzeria</title>
    <link rel="stylesheet" href="/pizzeria/assets/style.css">
</head>
<body>
<div class="login-wrap">
    <div class="login-box">
        <div class="logo">
            <h1>🍕 Pizzeria</h1>
            <p>Accès administrateur</p>
        </div>

        <?php if ($error): ?>
            <div class="flash error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="admin@pizzeria.dz"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required autofocus>
            </div>
            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" name="mot_de_passe" placeholder="********" required>
            </div>
            <button type="submit" class="btn btn-primary">Connexion</button>
        </form>
    </div>
</div>
</body>
</html>
