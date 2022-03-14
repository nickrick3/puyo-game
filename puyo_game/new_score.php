<?php
	session_start();
	if (isset($_SESSION['login']) && $_SESSION['login'] && isset($_SESSION['username'])){
		if (isset($_POST['score']) && isset($_POST['time'])){
			include_once('includes/db_helper.php');
			$db = new DBHelper;
			$db->insertResults($_SESSION['username'], $_POST['score'], $_POST['time']);
			$db->close();
			die('ok');
		} else{
			die("Nessun punteggio inviato.");
		}
	} else{
		die("Bisogna aver effettuato il login per inviare il punteggio.");
	}
?>
