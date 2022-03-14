<?php
	session_start();

	// controlla la validità del tipo e lo salva in una variabile
	$validTipo = array('highscore', 'avgscore', 'best_time', 'avgtime');
	if (isset($_GET['type']) && in_array($_GET['type'], $validTipo)){
		$tipo = $_GET['type'];
	}
	else{
		$tipo = 'highscore';
	}

	// controlla la validità della pagina e la salva in una variabile
	if(isset($_GET['page'])){
		$page = intval($_GET['page']);  //ritorna 0 se non è un int
	} else{
		$page = 0;
	}

	// carica i dati dal database
	include_once('includes/db_helper.php');
	$db = new DBHelper;
	$array = $db->getRanking($page, $tipo);
	$n_pages = $db->getNumberOfPagesRanking($tipo);
	$db->close();

	$title = "Puyo - Classifica";
	$section = 2;
	$includeCSS = ['table'];
	include_once("includes/nav_section.php");
?>
	<h1 class="table-title">CLASSIFICA</h1>
	<ul class="type-selector">
		<li><a href="?type=highscore" <?php echo $tipo=='highscore'?'class="active"':'';?>>Punteggio<br>Massimo</a></li>
		<li><a href="?type=avgscore"  <?php echo $tipo=='avgscore'?'class="active"':'';?> >Punteggio<br>Medio</a></li>
		<li><a href="?type=best_time" <?php echo $tipo=='best_time'?'class="active"':'';?>>Tempo<br>Massimo</a></li>
		<li><a href="?type=avgtime"  <?php echo $tipo=='avgtime'?'class="active"':'';?> >Tempo<br>Medio</a></li>
	</ul>
	<table>
		<thead>
			<tr>
				<th class="col1_3">Posizione</th>
				<th class="col2_3">Utente</th>
				<th class="col3_3"><?php echo ($tipo=='avgscore' or $tipo=='highscore')?'Punteggio':'Tempo in secondi'?></th>
			</tr>
		</thead>
		<tbody><?php
			$pos = $page*ITEMS_PER_PAGE;
			$score = -1;
			foreach ($array as $key => $value) {
				$pos++;
				if ($tipo == 'avgtime' or $tipo == 'best_time') {
					$score = floor($value['score']/100)/10;
				} else {
					$score = $value['score'];
				}
				echo "<tr><td class='col1_3'>${pos}</td><td class='col2_3'>{$value['player']}</td><td class='col3_3'>{$score}</td></tr>\n";
			}
			for ($i=count($array); $i < ITEMS_PER_PAGE; $i++) {
				echo "<tr><td class='col1_3'>-</td><td class='col2_3'>-</td><td class='col3_3'>-</td></tr>\n";
			}
		?></tbody>
	</table>
	<?php if($n_pages > 1){?>
	<div class="arrows">	
		<?php if($page>0){ ?>
			<a class="left" href="?type=<?php echo $tipo;?>&page=<?php echo $page-1;?>">&lt;</a>
		<?php } else {?>
			<div class='empty'> </div>
		<?php } ?>
		
		<p><?php echo ($page+1)."/"."$n_pages"; ?></p>
		
		<?php if($page < $n_pages-1){ ?>
			<a class="right" href="?type=<?php echo $tipo;?>&page=<?php echo $page+1;?>">&gt;</a>
		<?php } ?>
    </div>
	<?php } ?>
<?php include_once("includes/footer.php"); ?>
