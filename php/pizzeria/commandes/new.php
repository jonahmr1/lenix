<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../layout.php';
requireLogin();

$clients = $pdo->query("SELECT * FROM client ORDER BY nom")->fetchAll();
$pizzas  = $pdo->query("SELECT * FROM pizza WHERE disponible=1 ORDER BY nom, taille")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $client_id = intval($_POST['client_id'] ?? 0);
    $items     = $_POST['items'] ?? [];   // array of [pizza_id, quantite]

    $lignes = [];
    foreach ($items as $item) {
        $pid = intval($item['pizza_id'] ?? 0);
        $qty = intval($item['quantite'] ?? 0);
        if ($pid > 0 && $qty > 0) {
            $lignes[] = ['pizza_id' => $pid, 'quantite' => $qty];
        }
    }

    if (!$client_id) {
        $error = "Sélectionnez un client.";
    } elseif (empty($lignes)) {
        $error = "Ajoutez au moins une pizza.";
    } else {
        // calculate total
        $total = 0;
        foreach ($lignes as &$l) {
            $row = $pdo->prepare("SELECT prix FROM pizza WHERE id=?");
            $row->execute([$l['pizza_id']]);
            $l['prix'] = floatval($row->fetchColumn());
            $total += $l['prix'] * $l['quantite'];
        }
        unset($l);

        $pdo->beginTransaction();
        try {
            $pdo->prepare("INSERT INTO commande (client_id, total) VALUES (?,?)")
                ->execute([$client_id, $total]);
            $cmd_id = $pdo->lastInsertId();

            $ins = $pdo->prepare("INSERT INTO detail_commande (commande_id,pizza_id,quantite,prix_unitaire) VALUES (?,?,?,?)");
            foreach ($lignes as $l) {
                $ins->execute([$cmd_id, $l['pizza_id'], $l['quantite'], $l['prix']]);
            }
            $pdo->commit();
            flash("Commande #$cmd_id créée — total : " . number_format($total, 0, ',', ' ') . " DA");
            redirect("/commandes/detail.php?id=$cmd_id");
        } catch (Exception $e) {
            $pdo->rollBack();
            $error = "Erreur lors de la création : " . $e->getMessage();
        }
    }
}

layout_start('Nouvelle commande', 'commandes');
?>

<div class="page-header">
    <h2>Nouvelle commande</h2>
    <p><a href="<?= BASE ?>/commandes/index.php" style="color:var(--muted);text-decoration:none;">← Retour</a></p>
</div>

<?php if (!empty($error)): ?>
    <div class="flash error"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<div style="display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start;">

    <form method="POST" id="orderForm">
        <!-- Client -->
        <div class="card" style="margin-bottom:16px">
            <h3 style="font-family:'Lora',serif;font-size:17px;margin-bottom:16px;">Client</h3>
            <div class="form-group" style="margin:0">
                <label>Sélectionner un client</label>
                <select name="client_id" required>
                    <option value="">— choisir —</option>
                    <?php foreach ($clients as $c): ?>
                        <option value="<?= $c['id'] ?>" <?= ($_POST['client_id'] ?? '') == $c['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($c['prenom'] . ' ' . $c['nom']) ?> (<?= $c['telephone'] ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <!-- Pizzas -->
        <div class="card">
            <h3 style="font-family:'Lora',serif;font-size:17px;margin-bottom:16px;">Pizzas commandées</h3>

            <div id="items">
                <div class="item-row" style="display:grid;grid-template-columns:1fr 80px auto;gap:10px;margin-bottom:10px;align-items:end;">
                    <div class="form-group" style="margin:0">
                        <label>Pizza</label>
                        <select name="items[0][pizza_id]">
                            <option value="">— choisir —</option>
                            <?php foreach ($pizzas as $p): ?>
                                <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['nom']) ?> (<?= $p['taille'] ?>) — <?= number_format($p['prix'], 0, ',', ' ') ?> DA</option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group" style="margin:0">
                        <label>Qté</label>
                        <input type="number" name="items[0][quantite]" min="1" value="1">
                    </div>
                    <button type="button" onclick="removeRow(this)" style="background:transparent;border:none;color:var(--danger);cursor:pointer;font-size:20px;padding:0 4px;margin-top:18px;">×</button>
                </div>
            </div>

            <button type="button" onclick="addRow()" class="btn btn-ghost btn-sm" style="margin-top:4px;">
                + Ajouter une pizza
            </button>
        </div>

        <!-- pizza data for JS -->
        <script>
        const pizzaOptions = <?= json_encode(array_map(fn($p) => [
            'id'    => $p['id'],
            'label' => $p['nom'] . ' (' . $p['taille'] . ') — ' . number_format($p['prix'], 0, ',', '.') . ' DA',
            'prix'  => floatval($p['prix'])
        ], $pizzas)) ?>;

        let idx = 1;

        function buildSelect(name) {
            let s = `<select name="${name}"><option value="">— choisir —</option>`;
            pizzaOptions.forEach(p => {
                s += `<option value="${p.id}">${p.label}</option>`;
            });
            return s + '</select>';
        }

        function addRow() {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.style.cssText = 'display:grid;grid-template-columns:1fr 80px auto;gap:10px;margin-bottom:10px;align-items:end;';
            div.innerHTML = `
                <div class="form-group" style="margin:0">
                    <label>Pizza</label>
                    ${buildSelect('items[' + idx + '][pizza_id]')}
                </div>
                <div class="form-group" style="margin:0">
                    <label>Qté</label>
                    <input type="number" name="items[${idx}][quantite]" min="1" value="1">
                </div>
                <button type="button" onclick="removeRow(this)" style="background:transparent;border:none;color:var(--danger);cursor:pointer;font-size:20px;padding:0 4px;margin-top:18px;">×</button>
            `;
            document.getElementById('items').appendChild(div);
            idx++;
            bindChange();
        }

        function removeRow(btn) {
            const rows = document.querySelectorAll('.item-row');
            if (rows.length === 1) return;
            btn.closest('.item-row').remove();
            calcTotal();
        }

        function calcTotal() {
            let total = 0;
            document.querySelectorAll('.item-row').forEach(row => {
                const sel = row.querySelector('select');
                const qty = row.querySelector('input[type=number]');
                if (!sel || !qty) return;
                const pizza = pizzaOptions.find(p => p.id == sel.value);
                if (pizza) total += pizza.prix * parseInt(qty.value || 0);
            });
            document.getElementById('totalDisplay').textContent =
                total.toLocaleString('fr-DZ') + ' DA';
        }

        function bindChange() {
            document.querySelectorAll('.item-row select, .item-row input[type=number]').forEach(el => {
                el.removeEventListener('change', calcTotal);
                el.addEventListener('change', calcTotal);
                el.removeEventListener('input', calcTotal);
                el.addEventListener('input', calcTotal);
            });
        }

        document.addEventListener('DOMContentLoaded', bindChange);
        </script>

        <div style="margin-top:20px;">
            <button type="submit" class="btn btn-primary">Valider la commande</button>
        </div>
    </form>

    <!-- Summary sidebar -->
    <div class="card" style="position:sticky;top:20px;">
        <h3 style="font-family:'Lora',serif;font-size:17px;margin-bottom:20px;">Récapitulatif</h3>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--border);">
            <span style="color:var(--muted)">Total estimé</span>
            <strong style="font-size:22px;color:var(--accent)" id="totalDisplay">0 DA</strong>
        </div>
    </div>

</div>

<?php layout_end(); ?>
