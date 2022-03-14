// Costanti globali che rappresentano la dimensione del gioco
const COLS = 8;
const ROWS = 12;

// Intervallo di clock del gioco
const CLOCK_INTERVAL = 20;

///////////////////////////////////////////////////////////////Oggetto Game
function Game(gameArea) {
	// variavili di stato
	this.isStarted = false;
	this.isOver = false;
	this.gameClock = null;							// Contenitore del TimeInterval
	this.collapsed = false;							// Variabile di stato che indica se è avvenuto un collasso nell'ultimo clock
	this.fastFall = false;							// Indica se è attiva la caduta rapida o meno 
	
	// statistiche
	this.time = 0;
	document.getElementById("time").innerHTML = this.time;
	this.score = 0;
	document.getElementById("points").innerHTML = this.score;
	this.streak = 0;								// Numero di famiglie scoppiate in sequenza
	
	// variabili dipendenti dalla dimensione della finestra 
	this.PUYO_DIM = 40;								// Dimensione di un Puyo in pixel
	this.VERTICAL_STEP = [1, 2, 4, 5, 8, 10, 20];	// Array delle velocità
	this.speed = 0;									// Velocità attuale
	this.COLLAPSE_SPEED = 10;						// Velocità dei Puyo in caduta non controllata dal giocatore
	
	// playground
	this.playground = document.createElement("div");
	this.playground.setAttribute("id", "playground");
	gameArea.appendChild(this.playground);
	var redBar = document.createElement('div');		// barra rossa che indica il limite di game over
	redBar.setAttribute('id', 'red_bar');
	this.playground.appendChild(redBar);
	
	// liste di Puyo e variabili a esse relative
	this.grid = new Array();						// griglia delle posizioni dei Puyo
	for (var i = 0; i < ROWS; i++){
		for (var j = 0; j < COLS; j++){
			this.grid[i * COLS + j] = null;
		}
	}
	this.toCollapse = new Array();					// lista dei Puyo che devono concludere la caduta a seguito dello scoppio di famiglie sottostanti
	
	// coppia di Puyo attualmente in caduta
	this.movingPair = null;
	
	// lista delle famiglie
	this.familyList = new Array();
	
	// audio
	this.music = null;
	this.gameOverSound = null;
	
	// funzioni di callback
	this.onBegin = null;
	this.onPause = null;
	this.onResume = null;
	this.onEnd = null;
}

/////////////////////////////////////////////////////////////////////// AVVIO, PAUSA, GAMEOVER, RIAVVIO
Game.prototype.start = function(){
	if (this.onBegin != null)
		this.onBegin();
	
	if (this.music != null)
		this.music.play();
	
	this.gameClock = setInterval(this.clock.bind(this), CLOCK_INTERVAL);
	this.isStarted = true;
}

Game.prototype.pause = function(){
	if (this.gameClock != null)
		clearInterval(this.gameClock);
	
	if (this.music != null)
		this.music.pause();
	
	this.gameClock = null;
	
	if (this.onPause != null)
		this.onPause();
}

Game.prototype.resume = function(){
	this.gameClock = setInterval(this.clock.bind(this), CLOCK_INTERVAL);
	
	if (this.music != null){
		this.music.play();
	}
	
	if (this.onResume != null)
		this.onResume();
}

Game.prototype.gameover = function(){
	clearInterval(this.gameClock);
	this.gameClock = null;
	this.isOver = true;
	
	if (this.music != null)
		this.music.pause();
	if (this.gameOverSound != null)
		this.gameOverSound.play();
	
	if (this.onEnd != null)
		this.onEnd();
}

Game.prototype.reset = function(){
	// pulizia delle famiglie
	this.familyListReset();
	
	// pulizia della griglia
	this.grid.forEach(function(item, index, arr){
		if (item != null) {
			this.playground.removeChild(item.div);
			delete item;
			arr[index] = null;
		}
	});
	
	// eleminazione dell'ultima coppia
	if (this.movingPair != null){
		this.movingPair.destroy(this.playground);
		delete this.movingPair;
		this.movingPair = null;
	}
	
	// reset alle condizioni iniziali
	this.isStarted = false;
	this.isOver = false;
	this.score = 0;
	document.getElementById("points").innerHTML = this.score;
	this.time = 0;
	document.getElementById("time").innerHTML = this.time;
	
	this.speed = 0;
	this.streak = 0;
	
	if (this.music != null)
		this.music.load();
}

///////////////////////////////////////////////////////////////////////////// AGGIORNAMENTO DI TEMPO, PUNTI E VELOCITÀ
Game.prototype.updateTime = function(){
	this.time += CLOCK_INTERVAL;
	document.getElementById("time").innerHTML = Math.floor(this.time/100)/10;
}

Game.prototype.updateScore = function(destroyedPuyos){
	// I punti per ogni famiglia scoppiata sono:
	// 10 + il numero di Puyo nella famiglia in più rispetto a 4 moltiplicato per 5 + la streak
	this.score += 10 + (destroyedPuyos - 4) * 5 + this.streak;
	document.getElementById("points").innerHTML = this.score;
}

Game.prototype.updateSpeed = function(){
	if (this.time > 480000)			//Dopo 8 minuti
		this.speed = 6;
	else if (this.time > 300000)	//Dopo 5 minuti
		this.speed = 5;
	else if (this.time > 180000)	//Dopo 3 minuti
		this.speed = 4;
	else if (this.time > 90000)		//Dopo 90 secondi
		this.speed = 3;
	else if (this.time > 30000)		//Dopo 30 secondi
		this.speed = 2;
	else if (this.time > 10000)		//Dopo 10 secondi
		this.speed = 1;
	
	// Aggiusta la posizione dei Puyo in caduta controllata a un multiplo della velocità attuale
	if (this.movingPair != null){
		if (this.movingPair.p0 != null)
			this.movingPair.p0.adjustPosition(this.VERTICAL_STEP[this.speed]);
		if (this.movingPair.p1 != null)
			this.movingPair.p1.adjustPosition(this.VERTICAL_STEP[this.speed]);
	}
}


/////////////////////////////////////////////////////////////////FUNZIONE PERIODICA DI AGGIORNAMENTO DEL GIOCO
Game.prototype.clock = function(){
	this.updateTime();
	this.updateSpeed();
	
	// verifica se ci sono dei Puyo in caduta non controllata
	if (this.toCollapse.length > 0){
		var moved = false;
		for (var i = 0; i < this.toCollapse.length; i++){
			if (this.toCollapse[i].collapse(this.COLLAPSE_SPEED))
				moved = true;
			else
				// associa il Puyo preso in considerazione alla casella della griglia in cui si trova
				this.grid[Math.floor(this.toCollapse[i].Y * COLS / this.PUYO_DIM) + this.toCollapse[i].X] = this.toCollapse[i];
		}
		// se nessun puyo si è mosso si può procedere a svuotare toCollapse
		if (!moved){
			while (this.toCollapse.length > 0)
				this.toCollapse.pop();
		}
	}
	
	// toCollapse è vuoto e si è appena conclusa la caduta dei Puyo a seguito dello scoppio di una famiglia
	else if (this.collapsed){
		this.streak += 15;			// punti in più che verranno assegnati se avverrà un nuovo collasso
		this.collapsed = false;
		this.findFamilies();		// ricalcolo delle famiglie
		this.collapseFamilies();	// verifica se si sono formate nuove famiglie con più di 3 Puyo
	}
	
	// situazione priva di collassi e di coppia in caduta
	else if (this.movingPair == null) {
		this.streak = 0;			// reset della streak
		this.nextPair();			// nuova coppia
		//QUI SI POSSONO VERIFICARE LE CONDIZIONI DI GAMEOVER
	}
	
	// caduta controllata
	else
		this.fallCommand();
}


////////////////////////////////////////////////////////////////COMANDI PER LA COPPIA IN CADUTA CONTROLLATA
Game.prototype.nextPair = function(){
	this.movingPair = new Pair(this.PUYO_DIM);
	if (!this.movingPair.spawn(this.grid, this.playground))
		this.gameover();
}


Game.prototype.fallCommand = function(){
	if (!this.movingPair.fall(this.grid, this.VERTICAL_STEP[this.speed], this.fastFall, this.PUYO_DIM)){
		// qui entrambi i Puyo della coppia si sono fermati e sono stati inseriti nella griglia
		delete this.movingPair;
		this.movingPair = null;
		
		// controllo delle famiglie
		this.findFamilies();
		this.collapseFamilies();
	}
}

////////////////////////////////////////////////// salto orizzontale
Game.prototype.jumpCommand = function(dir_right){
	if (this.gameClock == null || this.movingPair == null)
		return;
	
	this.movingPair.jump(this.grid, dir_right, this.PUYO_DIM);
}

////////////////////////////////////////////////// rotazione
Game.prototype.rotateCommand = function(clockwise){
	if (this.gameClock == null || this.movingPair == null)
		return;
	
	this.movingPair.rotate(this.grid, clockwise, this.PUYO_DIM);
}

////////////////////////////////////////////////// cambia il Puyo che funge da perno nella coppia
Game.prototype.swapCommand = function(){
	if (this.gameClock == null || this.movingPair == null)
		return;
	
	this.movingPair.changePivot();
}


////////////////////////////////////////////////////////////////////// CREAZIONE DELLE FAMIGLIE

// fusione di due famiglie esistenti
Game.prototype.familyMerge = function(f1, f2){	
	var newFam = new Family;
	for (var member = f1.popMember(); member != null; member = f1.popMember())
		newFam.addMember(member);
	for (var member = f2.popMember(); member != null; member = f2.popMember())
		newFam.addMember(member);
	this.familyList.push(newFam);
}

// dato un Puyo e il suo vicino, verifica se devono far parte della stessa famiglia
Game.prototype.checkNeighbor = function(puyo, neighbor){
	// controlla se il vicino esiste e qual è il suo colore
	if (neighbor != null && neighbor.color == puyo.color) {
		// se il puyo considerato non ha già una famiglia
		if (puyo.family == null){
			if (neighbor.family == null) {
				// creo una nuova famiglia se anche il vicino non appartiene già a una
				var newFam = new Family;
				this.familyList.push(newFam);
				newFam.addMember(neighbor);
			}
			// se il vicino ha già una famiglia, aggiungo il nuovo Puyo a questa
			neighbor.family.addMember(puyo);
		}
		// il puyo considerato appartiene già a una famiglia
		else {
			if (neighbor.family == null)
				// se il vicino non ha famiglia, lo aggiungo a quella del Puyo che sto considerando
				puyo.family.addMember(neighbor);
			else if (puyo.family != neighbor.family)
				// fusione di famiglie
				this.familyMerge(puyo.family, neighbor.family);
		}
	}
}

// dato un Puyo posizionato nella griglia, controllo se appartiene a un gruppo (e quindi una famiglia)
Game.prototype.familyCheck = function(puyo){
	var puyoRow = Math.floor(puyo.Y / this.PUYO_DIM);
	var neighbor = null;
	
	// sinistra
	if (puyo.X > 0)
		this.checkNeighbor(puyo, this.grid[puyoRow * COLS + puyo.X - 1]);
	
	// sotto
	if (puyoRow < ROWS - 1)
		this.checkNeighbor(puyo, this.grid[(puyoRow + 1) * COLS + puyo.X]);
	
	// destra
	if (puyo.X < COLS - 1)
		this.checkNeighbor(puyo, this.grid[puyoRow * COLS + puyo.X + 1]);
}

// calcola tutte le famiglie
Game.prototype.findFamilies = function(){
	for (var i = this.grid.length - 1; i >= 0; i--){
		if (this.grid[i] != null)
			this.familyCheck(this.grid[i]);
	}
}


//////////////////////////////////////////////////////////////// GESTIONE DEL COLLASSO DELLE FAMIGLIE

// controlla ogni famiglia e verifica se deve collassare
Game.prototype.collapseFamilies = function(){
	for (var i = 0; i < this.familyList.length; i++){
		if (this.familyList[i].membersList.length >= 4){
			// aumenta i punti
			this.updateScore(this.familyList[i].membersList.length);
			
			if (this.familyList[i].sound != null)
				this.familyList[i].sound.play();
			
			this.familyDestroy(this.familyList[i], true);
			this.collapsed = true;		// aggiorna lo stato del gioco
		}
	}
	if (this.collapsed){
		this.familyListReset();			// le famiglie vengono resettate per essere ricalcolate a seguito della caduta dei Puyo
		this.findCollapsingPuyos();
	}
}

// trova tutti i Puyo che devono cadere a seguito del collasso di una famiglia sottostante
Game.prototype.findCollapsingPuyos = function(){
	// viene fatto un controllo per colonne a partire dal basso
	for (var col = 0; col < COLS; col++){
		var collapseDistance = 0;
		for (var row = ROWS - 1; row > 0; row--) {
			var puyo = this.grid[row * COLS + col];
			if (puyo == null)
				collapseDistance += this.PUYO_DIM;	
				// se nella casella considerata non c'è niente, eventuali Puyo sovrastanti dovranno scendere di una PUYO_DIM in più
			else{
				puyo.collapsing = collapseDistance;
				if (collapseDistance > 0){
					// se il Puyo deve scendere di almeno una casella, viene rimosso dalla griglia e inserito nella lista toCollapse
					this.toCollapse.push(puyo);
					this.grid[row * COLS + col] = null;
				}
			}
		}
	}
}


///////////////////////////////////////////////////////////////////////// DISTRUZIONE DELLE FAMIGLIE
Game.prototype.familyDestroy = function(oldFam, destroyMembers){
	for (var member = oldFam.popMember(); member != null; member = oldFam.popMember()){
		// in caso di reset, i membri non vanno distrutti
		if (destroyMembers){
			this.playground.removeChild(member.div);
			this.grid[Math.floor(member.Y * COLS / this.PUYO_DIM) + member.X] = null;
			delete member;
		}
	}
}

// reset delle famiglie senza distruggerne i membri
Game.prototype.familyListReset = function(){
	while (this.familyList.length > 0){
		var oldFam = this.familyList.pop();
		this.familyDestroy(oldFam, false);
		delete oldFam;
	}
}


/////////////////////////////////////////////////////////////////////// RIDIMENSIONAMENTO

// risimensiona tutti i Puyo
Game.prototype.resizePuyos = function(newDim){
	if (this.movingPair != null){
		if (this.movingPair.p0 != null)
			this.movingPair.p0.resizeSelf(this.PUYO_DIM, newDim);
		if (this.movingPair.p1 != null)
			this.movingPair.p1.resizeSelf(this.PUYO_DIM, newDim);
	}
	
	for (var i = 0; i < this.toCollapse.length; i++)
		this.toCollapse[i].resizeSelf(this.PUYO_DIM, newDim);
	
	for (var i = 0; i < ROWS * COLS; i++){
		if (this.grid[i] != null)
			this.grid[i].resizeSelf(this.PUYO_DIM, newDim);
	}
}

// ridimensiona il playground
Game.prototype.resizePlayground = function(){
	this.playground.style.width = (COLS * this.PUYO_DIM) + 'px';
	this.playground.style.height = (ROWS * this.PUYO_DIM) + 'px';
}

// funzione per il ridimensionamento globale
Game.prototype.resize = function(newDim){
	this.resizePuyos(newDim);
	this.PUYO_DIM = newDim;
	
	// cambia la velocità
	switch (this.PUYO_DIM){
		case 20:
			this.VERTICAL_STEP = [1, 2, 2, 4, 4, 5, 10];
			this.COLLAPSE_SPEED = 5;
			break;
		case 30:
			this.VERTICAL_STEP = [1, 2, 3, 5, 6, 10, 15];
			this.COLLAPSE_SPEED = 10;
			break;
		case 40:
			this.VERTICAL_STEP = [1, 2, 4, 5, 8, 10, 20];
			this.COLLAPSE_SPEED = 10;
			break;
	}
	
	this.resizePlayground();
}

//////////////////////////////////////////////////////////////// Gestione della musica
Game.prototype.mute_unmute = function(){
	if (this.music == null || this.gameClock == null)
		return;
	
	if (!this.music.paused)
		this.music.pause();
	else if (this.isStarted && !this.isOver)
		this.music.play();
}