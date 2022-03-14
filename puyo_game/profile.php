<?php
	session_start();
	include('includes/require_login.php');

	// carica i dati dal database
	include_once('includes/db_helper.php');
	$db = new DBHelper;
	$db->loadStats($_SESSION['username']);
	$nGames = $db->getNumberOfGames($_SESSION['username']);
	$rankPositionHighscore = $db->getRankPosition($_SESSION['username'], 'highscore');
	$rankPositionAvgscore  = $db->getRankPosition($_SESSION['username'], 'avgscore');
	$rankPositionBestTime  = $db->getRankPosition($_SESSION['username'], 'best_time');
	$rankPositionAvgTime  = $db->getRankPosition($_SESSION['username'], 'avgtime');
	$db->close();

	$subtitle = 'Statistiche';
	include_once("includes/profile_title_and_menu.php");
?>
<table>
	<tbody>
	<tr>
		<td class="col1_2">Partite giocate</td>
		<td class="col2_2"><?php echo $nGames;?></td>
	</tr>
	
	<tr class="divider"><td></td><td></td></tr>
	<tr>
		<td class="col1_2">Punteggio Massimo</td>
		<td class="col2_2"><?php echo $_SESSION['highscore'];?></td>
	</tr>
	<tr>
		<td class="col1_2">Posizione in classifica </td>
		<td class="col2_2"><?php echo $rankPositionHighscore;?></td>
	</tr>
	
	<tr class="divider"><td></td><td></td></tr>
	<tr>
		<td class="col1_2">Punteggio Medio</td>
		<td class="col2_2"><?php echo $_SESSION['avgscore'];?></td>
	</tr>
	<tr>
		<td class="col1_2">Posizione in classifica </td>
		<td class="col2_2"><?php echo $rankPositionAvgscore;?></td>
	</tr>
	
	<tr class="divider"><td></td><td></td></tr>
	<tr>
		<td class="col1_2">Tempo Massimo</td>
		<td class="col2_2"><?php echo floor($_SESSION['best_time']/100)/10;?></td>
	</tr>
	<tr>
		<td class="col1_2">Posizione in classifica </td>
		<td class="col2_2"><?php echo $rankPositionBestTime;?></td>
	</tr>
	
	<tr class="divider"><td></td><td></td></tr>
	<tr>
		<td class="col1_2">Tempo Medio</td>
		<td class="col2_2"><?php echo floor($_SESSION['avgtime']/100)/10;?></td>
	</tr>
	<tr>
		<td class="col1_2">Posizione in classifica </td>
		<td class="col2_2"><?php echo $rankPositionAvgTime;?></td>
	</tr>
	</tbody>
</table>
<?php include_once("includes/footer.php"); ?>
