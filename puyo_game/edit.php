<?php
	session_start();

	include('includes/require_login.php');

	function no_edit($message = ''){
		$subtitle = 'Modifica';
		$includeJS = ['edit'];
		$includeCSS [] = 'form';
		include_once("includes/profile_title_and_menu.php");
?>
	<form name="edit" action="edit.php" method="POST" onsubmit="return validateForm();">
		<h2>Modifica Password</h2>
		<p id="error"><?php echo $message != ''?$message:"Dummy error";?></p>
		<div class="form_item">
			<p>Nuova Password</p>
			<input type="password" placeholder="Nuova Password" name="password" required>
		</div>
		<div class="form_item">
			<p>Ripeti Password</p>
			<input type="password" placeholder="Ripeti Password" name="password_repeat" required>
		</div>
		<button type="submit">CAMBIA PASSWORD</button>
	</form>
<?php
		include_once("includes/footer.php");
	}

	function ok_edit(){
		$title = "Puyo - Modifica avvenuta";
		$message_text = "Modifica avvenuta con successo!";
		include_once("includes/message.php");
	}

	if (isset($_POST['password'])){
		if (!preg_match('/^[A-Za-z0-9\-_]{8,}$/', $_POST['password'])){
			no_edit("La password deve contenere almeno 8 caratteri alfanumerici", $_POST['username']);
		} else{
			include_once("includes/db_helper.php");
			$db = new DBHelper;
			$edit_result = $db->editPassword($_SESSION['username'], $_POST['password']);
			$db->close();
			if ($edit_result) {
				ok_edit();
			} else{
				no_edit("Errore indefinito");
			}
		}
	} else{
		no_edit();
	}
 ?>
