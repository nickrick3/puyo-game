<!DOCTYPE html>
<html lang="it">
	<head>
		<title><?php if (isset($title)) echo $title; ?></title>
		
		<meta charset="UTF-8">
		<meta name="author" content="Nicola Riccardi">
		
		<link rel="icon" type="image/png" href="img/puyo20_1.png"/>
		
		<link rel="stylesheet" type="text/css" href="style/fonts.css">
		<link rel='stylesheet' type='text/css' href='style/style.css'>
		
		<?php
			if (isset($includeCSS)){
				foreach ($includeCSS as $value)
					echo "\t\t<link rel='stylesheet' type='text/css' href='style/{$value}.css'>\n";
			}
			
			if (isset($includeJS)){
				foreach ($includeJS as $value)
					echo "\t\t<script src='js/{$value}.js'></script>\n";
			}
		?>
	</head>
	<body>
		<nav>
			<button type='button'
				<?php if (isset($section) && $section == 0) echo "class='active'";?>
				onclick="<?php if (isset($section) && $section == 0) echo "if (askUser()) ";?>location.href='index.php';">GIOCA</button>
			
			<button type='button' 
				<?php if (isset($section) && $section == 1) echo "class='active'";?>
				onclick="<?php if (isset($section) && $section == 0) echo "if (askUser()) ";?>location.href='guide.php'">REGOLE</button>
			
			<button type='button'
				<?php if (isset($section) && $section == 2) echo "class='active'"; ?>
				onclick="<?php if (isset($section) && $section == 0) echo "if (askUser()) ";?>location.href='rankings.php'">CLASSIFICHE</button>
			
			<?php
				if (isset($_SESSION["login"]) && $_SESSION["login"] && isset($_SESSION['username'])){
					if(isset($isProfilePage) && $isProfilePage){
						$type = 2;
					}
					else {
						$type = 1;
					}
				}
				else {
					$type = 0;
				}
			?>
			
			<button type='button' 
				<?php if (isset($section) && $section == 3) echo "class='active'";?>
				onclick="<?php if (isset($section) && $section == 0) echo "if (askUser()) ";?>
				location.href='<?php echo $type==0?'login.php':($type==1?'profile.php':'exit.php') ?>'">
				<?php echo $type==0?'ACCEDI':($type==1?'PROFILO':'ESCI') ?>
			</button>	
		</nav>
		<main>
