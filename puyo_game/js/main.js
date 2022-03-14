var game;

// Chiede conferma al giocatore se vuole uscire prima che il gioco sia finito
function askUser() {
	if (game.isStarted && !game.isOver) {
		game.pause();
		return confirm("Uscendo perderai i progressi, continuare?");
	}
	else
		return true;
}

// Calcola la dimensione che devono aver i puyo per far entrare tutto il playground
// nello schermo. Il calcolo viene effettuato ignorando la larghezza perchè è molto
// minore dell'altezza
function resizeGame(){
	//Metto in pausa il gioco se è stato avviato
	if (game != null && game.isStarted && !game.isOver)
		game.pause();
	
	var winHeight = Math.floor((window.innerHeight - 30) * 0.9);
	var newDim;
	
	if (winHeight/ROWS >= 40)
		newDim = 40;
	else if (winHeight/ROWS >= 30)
		newDim = 30;
	else
		newDim = 20;
	
	if (game != null)
		game.resize(newDim);
}

// Crea il pop up per la pausa
function createPausePopup(){
	var popUp = document.createElement('div');
	popUp.setAttribute('class', 'popup');
	popUp.setAttribute('id', 'pause');
	
	var title, text;
	
	title = document.createElement('h1');
	title.innerHTML = "PAUSA";
	
	text = document.createElement('div');
	text.innerHTML = "<p>Clicca ESC per riprendere la partita</p>";
	
	popUp.appendChild(title);
	popUp.appendChild(text);
	
	document.body.children[1].appendChild(popUp);
}

// Funzione che crea il pop up di game over
function createGameOverPopup(betterScore, betterTime){
	var popUp = document.createElement('div');
	popUp.setAttribute('class', 'popup');
	popUp.setAttribute('id', 'game_over');
	
	var title, btn1, btn2, text;
	
	title = document.createElement('h1');
	title.innerHTML = "GAME OVER";
	
	//// Bottone per riavviare direttamente la partita
	btn1 = document.createElement('button');
	btn1.innerHTML = "RIGIOCA";
	btn1.onclick = function(){
		document.body.children[1].removeChild(document.getElementById('game_over'));
		game.reset();
		game.start();
	}
	
	
	//// Bottone per tornare al titolo, senza perdere le informazioni su miglior tempo e miglior punteggio
	btn2 = document.createElement('button');
	btn2.innerHTML = "TORNA AL TITOLO";
	btn2.onclick = function(){
		document.body.children[1].removeChild(document.getElementById('game_over'));
		game.reset();
		
		game.playground.style.display = 'none';
		document.getElementById("info_block").style.display = "none";
		
		document.getElementById('game_title').style.display = 'block';
	}
	
	text = document.createElement('div');
	text.innerHTML = "<p>Punteggio: " + game.score + (betterScore ? "<span>NUOVO RECORD!</span>":"") + "</p>";
	text.innerHTML += "<p>Tempo: " + Math.floor(game.time/100)/10 +  (betterTime ? "<span>NUOVO RECORD!</span>":"") + "</p>";
	
	popUp.appendChild(title);
	popUp.appendChild(text);
	popUp.appendChild(btn1);
	popUp.appendChild(btn2);
	
	document.body.children[1].appendChild(popUp);
}

window.onload = function(){
	game = new Game(document.body.children[1]);		// Passo al costruttore di Game l'oggetto del DOM a cui appendere il playground
	resizeGame();
	
	// Audio del gioco
	game.music = new Audio("audio/Clear_Skies.mp3");
	game.music.loop = true;
	game.gameOverSound = new Audio("audio/GameOver.wav");
	
	// Handler della tastiera
	document.body.addEventListener("keydown", keyHandler);
	document.body.addEventListener("keyup", keyHandlerUp);
	
	
	game.onBegin = function(){
		// Nascondo il titolo e mostro i punteggi
		document.getElementById("game_title").style.display = 'none';
		game.playground.style.display = 'block';
		document.getElementById("info_block").style.display = 'block';
	}
	
	game.onPause = function(){
		if (document.getElementById('pause'))
			return;
		createPausePopup();
	}
	
	game.onResume = function(){
		document.body.children[1].removeChild(document.getElementById('pause'));
	}
	
	game.onEnd = function(){
		// variabili che determinano l'aspetto del pop up di game over
		var betterScore = false, betterTime = false;
		
		// aggiorn, se serve, i punteggi migliori
		if (game.score > highscore) {
			highscore = game.score;
			betterScore = true;
			document.getElementById("highscore").innerHTML = highscore;
		}
		
		if (game.time > best_time){
			best_time = game.time;
			betterTime = true;
			document.getElementById("bestTime").innerHTML = Math.floor(best_time/100)/10;
		}
		
		createGameOverPopup(betterScore, betterTime);
		
		// Invia il nuovo punteggio al database
		if (loggedIn)
			sendResults(game.score, game.time);
	}
}

window.onblur = function(){
	if (game.isStarted && !game.isOver)
		game.pause();
}

window.onresize = function(){
	resizeGame();
}