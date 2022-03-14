<?php
	session_start();

	function no_login($message = '', $username = ''){
		$title = "Puyo - Login";
		$section = 3;
		$includeCSS = ['form'];
		$includeJS = ['login'];
		include_once("includes/nav_section.php");
?>
	
		<form name="login" action="login.php" method="POST" onsubmit="return validateForm();">
			<h2>Login</h2>
			<p id="error"><?php echo $message != ''?$message:"error";?></p>
			<div class='form_item'>
				<p>Username</p>
				<input type="text" placeholder="Username" name="username" value="<?php echo $username;?>" required>
			</div>
			<div class='form_item'>
				<p>Password</p>
				<input type="password" placeholder="Password" name="password" required>
			</div>
			<button type="submit">LOGIN</button>
			<a href="register.php">Non hai un account? Registrati!</a>
		</form>
	
<?php
		if($message != ''){
?>
	<script type="text/javascript">
		document.getElementById("error").style.display = 'block';
	</script>
<?php
		}
		include_once("includes/footer.php");
	}

	function ok_login(){
		$title = "Puyo - Login avvenuto";
		$message_text = "Login avvenuto con successo!";
		include_once("includes/message.php");
	}

	if (isset($_POST['username']) && isset($_POST['password'])){
		if (!preg_match('/^[A-Za-z0-9]{4,}$/', $_POST['username'])){
			no_login("L'username deve contenere almeno 4 caratteri alfanumerici", $_POST['username']);
		} else if (!preg_match('/^[A-Za-z0-9]{8,}$/', $_POST['password'])){
			no_login("La password deve contenere almeno 8 caratteri alfanumerici", $_POST['username']);
		} else{
			include_once("includes/db_helper.php");
			$db = new DBHelper;
			$login_result = $db->login($_POST['username'], $_POST['password']);
			$db->close();
			switch ($login_result) {
				case 0:
					ok_login();
					break;
				case 1:
					no_login("Username non trovato", $_POST['username']);
					break;
				case 2:
					no_login("Password errata", $_POST['username']);
					break;
				default:
					no_login('');
					break;
			}
		}
	} else{
		no_login();
	}
?>
