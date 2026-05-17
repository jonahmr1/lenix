<?php ini_set('display_errors', 1); error_reporting(E_ALL); ?>

<!DOCTYPE html>
<html>
<head>
	<style>
		.main  {
			display: flex;
			flex-direction: row;
			background-color: aliceblue;
			justify-content: space-between;
			width: 100%;
		}
		.main > * {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid black;
		}
		.left {
			flex: 1;
			flex-direction: column;
		}
		.center {
			flex: 4;
		}
		.right {
			flex: 4;
		}
	</style>
</head>
<body
	style="font-family:monospace;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;gap:1rem">
	<div class="main">
		<div class="left">
			<?php
				$conn = mysqli_connect("localhost", "root", "");

				if (isset($_POST["deleteDB"])) {
					mysqli_query($conn, "DROP DATABASE " . $_POST["deleteDB"]);
				}

				if (isset($_POST["dbName"]) && $_POST["dbName"] !== "") {
					mysqli_query(mysqli_connect("localhost", "root", ""), "CREATE DATABASE " . $_POST["dbName"]);
				}
				
				if (isset($_POST["tableName"]) && $_POST["tableName"] !== "") {
					mysqli_select_db($conn, $_POST["selectDB"]);  
					$cols = [];
					foreach ($_POST["colName"] as $i => $name) {
						$col = "`$name` " . $_POST["colType"][$i];
						if (isset($_POST["nn"][$i])) $col .= " NOT NULL";
						if (isset($_POST["pk"][$i])) $col .= " PRIMARY KEY";
						$cols[] = $col;
					}
					mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `" . $_POST["tableName"] . "` (" . implode(", ", $cols) . ")");
				}

				$tables = null;
				if (isset($_POST["selectDB"])) {
					$tables = mysqli_query($conn, "SHOW TABLES FROM " . $_POST["selectDB"]);
				}

				$columns = null;
				if (isset($_POST["selectTable"])) {
						$columns = mysqli_query($conn, "SHOW COLUMNS FROM `" . $_POST["selectTable"] . "` IN `" . $_POST["selectDB"] . "`");
				}

				$DBs = mysqli_query($conn, "SHOW DATABASES ");
				$ignoreDBs = ["information_schema", "mysql", "performance_schema", "phpmyadmin"];
				$found = false;

				while ($db = mysqli_fetch_array($DBs)) {
					if (in_array($db[0], $ignoreDBs)) continue;
					$found = true;
					?>
						<div style='display: flex'>
							<form method="post">
								<input type="hidden" name="selectDB" value="<?= $db[0] ?>">
								<button type="submit"><?= $db[0] ?></button>
							</form>
							<form method="post">
								<input type="hidden" name="deleteDB" value="<?= $db[0] ?>">
								<button type="submit">delete</button>
							</form>
						</div>
					<?php
				}

				if (!$found) echo "<div>no DBs found</div>";
			?>
			<form method="post">
				<input type="text" name="dbName" placeholder="db name" />
				<button type="submit">create new DB</button>
			</form>
		</div>
		<?php
			if ($tables) {
				echo "<div class='center'>";
					echo "<div
						style='
							display:flex;
							flex-direction:column;
						'
						class='center'
					>";
						if (mysqli_num_rows($tables) > 0) {
							while ($row = mysqli_fetch_array($tables)) {
								echo "
									<form method='post'>
										<input type='hidden' name='selectDB' value='" . $_POST["selectDB"] . "' />
										<input type='hidden' name='selectTable' value='$row[0]' />
										<button type='submit'>$row[0]</button>
									</form>
								";
							}
						} else {
							echo "<div class='center'>no tables found</div>";
						}
						echo "
							<form method='post' style='display:flex; flex-direction:column'>
								<input type='hidden' name='selectDB' value='" . $_POST["selectDB"] . "' />

								<input type='text' name='tableName' placeholder='table name' />
								<div id='cols'>
									<div style='display:flex; gap:4px'>
										<input type='text' name='colName[]' placeholder='column name' />
										<select name='colType[]'>
											<option>INT</option>
											<option>VARCHAR(255)</option>
											<option>TEXT</option>
											<option>DATE</option>
											<option>BOOLEAN</option>
											<option>FLOAT</option>
										</select>
										<label><input type='checkbox' name='pk[]' /> PK</label>
										<label><input type='checkbox' name='nn[]' /> NN</label>
									</div>
								</div>
								<button
									type='button'
									onclick='document.getElementById(&quot;cols&quot;).insertAdjacentHTML(&quot;beforeend&quot;, document.getElementById(&quot;cols&quot;).innerHTML)'
								>add column</button>
								<button type='submit'>create table</button>
							</form>
						";
					echo "</div>";
					echo "<div
						class='center'
					>";
						if ($columns && mysqli_num_rows($columns) > 0) {
							echo "<table border='1' cellpadding='4' style='border-collapse:collapse'>";
							echo "<tr><th>Column</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
							while ($col = mysqli_fetch_array($columns)) {
									echo "<tr>
											<td>{$col['Field']}</td>
											<td>{$col['Type']}</td>
											<td>{$col['Null']}</td>
											<td>{$col['Key']}</td>
											<td>{$col['Default']}</td>
											<td>{$col['Extra']}</td>
									</tr>";
							}
							echo "</table>";
						}
					echo "</div>";
				echo "</div>";
			} else {
				echo "<div class='center'>no DBs selected</div>";
			}
		?>
	</div>
</body>
</html>