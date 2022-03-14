<?php
	session_start();
	
	$loggedIn = isset($_SESSION["login"]) && $_SESSION["login"];
	if ($loggedIn){
		include_once("includes/db_helper.php");
		$db = new DBHelper;
		$db->loadStats($_SESSION['username']);
		$db->close();
	}
	
	$title = "PUYO";
	$section = 0;
	$includeCSS = ["game"];
	$includeJS = ["keyboard", "puyo", "pair", "family", "game", "ajax", "main"];
	include_once("includes/nav_section.php");
?>
	<div id="game_title">
		<img src="img/titolo.png" alt="PUYO">
		<button onclick="if (game != null) game.start();">AVVIA LA PARTITA</button>
	</div>
	<div id="info_block" class="right">
		<p>TEMPO</p>
		<p id="time"></p><br>
		<p>PUNTI</p>
		<p id="points"></p><br>
		<p>MIGLIOR PUNTEGGIO</p>
		<p id="highscore"><?php echo ($loggedIn) ? $_SESSION["highscore"] : 0;?></p><br>
		<p>MIGLIOR TEMPO</p>
		<p id="bestTime"><?php echo ($loggedIn) ? floor($_SESSION["best_time"]/100)/10 : 0; ?></p><br>
	</div>

	<script>
		loggedIn = <?php echo $loggedIn?"true":"false";?>;
		highscore = <?php echo $loggedIn?$_SESSION["highscore"]:0;?>;
		best_time = <?php echo $loggedIn?$_SESSION["best_time"]:0;?>;
	</script>

<?php include_once("includes/footer.php"); ?>