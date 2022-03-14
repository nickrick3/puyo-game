<?php
	if(isset($subtitle)){
		$title = "Puyo - {$subtitle}";
	} else {$title = "Puyo - Profilo";}
	$section = -1;
	$isProfilePage = true;
	$includeCSS [] = 'table';
	include_once("includes/nav_section.php");
?>
<h1 class="table-title"><?php echo $subtitle;?></h1>
<h2 class="table-title"><?php echo $_SESSION['username'];?></h2>
<h3 class="table-title"><?php echo $_SESSION['email'];?></h3>
<ul class = "type-selector">
	<li><a href="profile.php"   <?php echo (isset($subtitle) && $subtitle=='Statistiche') ?'class="active"':'';?>>Statistiche</a></li>
	<li><a href="history.php" <?php echo (isset($subtitle) && $subtitle=='Cronologia')  ?'class="active"':'';?>>Cronologia</a></li>
	<li><a href="edit.php"    <?php echo (isset($subtitle) && $subtitle=='Modifica')    ?'class="active"':'';?>>Modifica password</a></li>
	<li><a href="delete.php"  <?php echo (isset($subtitle) && $subtitle=='Elimina')    ?'class="active"':'';?>
		onclick="return confirm('Questa azione non pu\u00f2 essere annullata, continuare?');">Elimina account</a></li>
</ul>
