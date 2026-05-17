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
	</style>
</head>
<body
	style="font-family:monospace;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;gap:1rem">
	<div class="main">
		<div class="left">
			<?php
				$conn = mysqli_connect("localhost", "root", "");

				if (isset($_POST["deleteDB"])) {
					$safe = mysqli_real_escape_string($conn, $_POST["deleteDB"]);
					mysqli_query($conn, "DROP DATABASE `$safe`");
				}

				if (isset($_POST["createDB"])) {
					$dbName = trim($_POST["dbName"]);
					if ($dbName !== "") {
						$conn = mysqli_connect("localhost", "root", "");
						$safe = mysqli_real_escape_string($conn, $dbName);
						mysqli_query($conn, "CREATE DATABASE `$safe`");
					}
				}

				$result = mysqli_query($conn, "SHOW DATABASES");
				$ignoreDBs = ["information_schema", "mysql", "performance_schema", "phpmyadmin"];
				$found = false;

				while ($row = mysqli_fetch_array($result)) {
					if (in_array($row[0], $ignoreDBs)) continue;
					$found = true;
					?>
						<div style='display: flex'>
							<button><?= $row[0] ?></button>
							<form method="post">
								<input type="hidden" name="deleteDB" value="<?= $row[0] ?>">
								<button type="submit">delete</button>
							</form>
						</div>
					<?php
				}

				if (!$found) echo "<div>no DBs found</div>";
			?>
			<form method="post">
				<input type="text" name="dbName"  placeholder="db name" />
				<button type="submit" name="createDB">create new db</button>
			</form>
		</div>
		<div class="center">no DBs selected</div>
	</div>
</body>
</html>