<?php
	session_start();
	$title = "Puyo - Guida";
	$section = 1;
	$includeCSS = ['article'];
	include_once("includes/nav_section.php");
?>
	<article>
		<h1>GUIDA</h1>
		<div>
			<h2>Introduzione</h2>
			<img src="img/Pair_example.png" class="left" alt="Puyo rosso cattivo e Puyo blu spaventato">
			<p>
				Anno 202X. I Puyo, sferette colorate della Dimensione Pastello, stanno invadendo gli schermi di tutta la Terra.
				La situazione è disperata e dovrai resistere al loro assedio il più a lungo possibile per permettere alla resistenza di organizzarsi.
			</p>
			<span>NON LASCIARE CHE SUPERINO LA LINEA ROSSA O SARÀ LA FINE PER IL TUO DISPLAY!</span>
		</div>
		<div>
			<h2>Comandi</h2>
			<h3>Movimento</h3>
			<ul>
				<li><img src="img/right_left.png" alt="Freccia destra/sinistra"/>: sposta a destra/sinistra i Puyo che cadono.</li>
				<li><img src="img/down.png" alt="Freccia giù"/>: stimola i Puyo a cadere MOLTO più velocemente, da usare con attenzione.</li>
			</ul>
			<h3>Rotazione</h3>
			<p>
				Quando i Puyo sono in coppia, puoi costringerli a cambiare da posizione orrizzontale a verticale e viceversa, se c'è uno spazio 
				libero in cui spostarsi. Uno dei due farà da perno e l'altro girerà intorno a lui.
			</p>
			<ul>
				<li><img src="img/A_button.png" alt="Tasto A"/><img src="img/D_button.png" alt="Tasto D"/>: ruota in senso antiorario/orario la coppia di Puyo che cade.</li>
				<li><img src="img/W_button.png" alt="Tasto W"/>: cambia il Puyo che fa da perno per la rotazione.</li>
			</ul>
			<h3>Altro</h3>
			<ul>
				<li><img src="img/ESC_button.png" alt="Tasto ESC"/>: mette in pausa il gioco.</li>
				<li><img src="img/M_button.png" alt="Tasto M"/>: interrompe o riprende la musica.</li>
			</ul>
		</div>
		<div>
			<h2>Regole del gioco</h2>
			<h3>I Puyo</h3>
			<p>
				I Puyo ti attaccheranno a coppie, ma per nostra fortuna non sono capaci di spostarsi autonomamente e potrai spostarli come vorrai.
				Tuttavia, più tempo passa e più i Puyo diventano impazzienti di intasarti lo schermo: con il passare del tempo diventeranno man mano
				più veloci e ingestibili.
			</p>
			<img src="img/AllPuyos.png" class="right" alt="Tutti i Puyo">
			<p>
				I Puyo hanno 4 colori diversi e si mescolano tra di loro perchè odiano trovarsi vicino ad altri Puyo dello stesso colore: 
				se riuscirai a unire gruppi di 4 o più dello stesso colore scoppieranno pur di non rimanere insieme.
				<br><br>
				Per essere considerati un gruppo, i Puyo di uno stesso colore devono toccarsi orrizzontalmente o verticalmente.
				Quando un gruppo esplode, tutti i Puyo che stavano sopra di loro cadranno fino a raggiungere il fondo o altri Puyo sotto di loro.
				<br><br>
				Se anche solo un Puyo riesce a posizionarsi sopra la linea rossa, sarà GAME OVER.
			</p>
			<h3>I Punti</h3>
			<img src="img/POP_dimonstration.png" class="right" alt="Dimostrazione dei Puyo che scoppiano">
			<p>
				Scoppiare dei gruppi di Puyo aumenterà i punti di 10 più altri 5 per ogni Puyo in più rispetto ai 4 necessari per formare il gruppo.
				<br><br>
				La caduta derivante dal collasso di un gruppo potrebbe portare alla formazione di altri gruppi: ogni volta che ciò accade vengono aggiunti 15 punti bonus a ogni gruppo scoppiato. Questo fenomeno è chiamato STREAK e viene resettato a 0 ogni volta che si interrompe la serie di scoppi e arriva una nuova coppia.
			</p>
		</div>
	</article>
<?php include_once("includes/footer.php"); ?>
