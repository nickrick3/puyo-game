<?php
	session_start();
	include('includes/require_login.php');

	$_SESSION['login'] = false;
	$title = "Puyo - Logout";
	$message_text = "Logout avvenuto con successo!";
	$message_href = "login.php";
	$message_button = "Accedi";
	include_once("includes/message.php");
?>
