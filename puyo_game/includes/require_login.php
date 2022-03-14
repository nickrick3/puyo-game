<?php
	if(!(isset($_SESSION['login']) && $_SESSION['login'])){
		http_response_code(403);  //unauthorized
		$title = "Puyo - Errore";
		$message_text = "Devi effettuare il login per accedere a questa pagina.";
		$message_href = "login.php";
		$message_button = "Accedi";
		include_once("includes/message.php");
		die();
	}
?>
