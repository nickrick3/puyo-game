<?php
	session_start();
	include('includes/require_login.php');

	include_once('includes/db_helper.php');
	$db = new DBHelper;
	$success = $db->deleteAccount($_SESSION['username']);
	$db->close();

	if ($success){
		$_SESSION['login'] = false;
		$title = "Puyo - Account eliminato";
		$message_text = "Account eliminato con successo";
		$message_href = "login.php";
		$message_button = "Accedi";
	} else{
		$title = "Puyo - Errore";
		$message_text = "Errore nell'eliminazione dell'account, riprovare.";
		$message_href = "delete.php";
		$message_button = "Elimina account";
	}
	include_once("includes/message.php");
?>
