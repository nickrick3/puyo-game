<?php
// pagina con messaggio e pulsante per giocare.
// prima di includere bisogna impostare $title e $message
include_once("includes/nav_section.php");
?>
	<div class="message">
		<p><?php echo isset($message_text)?$message_text:''?></p>
		<a href="<?php echo isset($message_href)?$message_href:'index.php'?>"
		title="<?php echo isset($message_button)?$message_button:'Gioca'?>">
			<?php echo isset($message_button)?$message_button:'Gioca'?>
		</a>
	</div>
<?php include_once("includes/footer.php");?>
