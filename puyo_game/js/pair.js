//////////////////////////////////////////////////////costanti che indicano l'orientamento della coppia di Puyo che sta cadendo
const RIGHT = 0; 	//p0 a sinistra e p1 a destra
const UP = 1; 		//p0 sotto e p1 sopra
const LEFT = 2; 	//p0 a destra e p1 a sinistra
const DOWN = 3; 	//p0 sopra e p1 sotto


//////////////////////////////////////////////////////Oggetto Pair (ovvero la coppia di Puyo controllata dal giocatore)
function Pair(dimension){
	var X0 = Math.floor(Math.random() * (COLS - 1));	//Posizione del primo Puyo
	this.p0 = new Puyo(X0, dimension);					//Primo Puyo della coppia
	this.p1 = new Puyo(X0 + 1, dimension);				//Secondo Puyo
	this.direction = RIGHT;								//Orientamento della coppia, indicato come la posizione di p1 rispetto a p0
	
	//Il bordo di p0 viene evidenziato per rendere più chiaro che è il perno delle rotazioni
	this.p0.div.style.border = '1px dashed white';
}
// NOTA: i due Puyo in caduta si separano solo se uno dei due incontra un ostacolo sotto di sè


Pair.prototype.spawn = function(grid, playground){
	playground.appendChild(this.p0.div);
	playground.appendChild(this.p1.div);
	
	// Condizione di GAME OVER
	if (grid[this.p0.X + COLS] != null || grid[this.p1.X + COLS] != null)
		return false;
	return true;
}


Pair.prototype.fall = function(grid, speed, fastFall, dim){
	var moved = false;
	var currentRow, first, second;
	
	// Determina quale Puyo debba essere mosso per primo in base a quale si trova
	// più in basso. Se l'orientamento è orizzontale viene sempre mosso prima p0
	if (this.direction == DOWN){
		first = this.p1;
		second = this.p0;
	}
	else {
		first = this.p0;
		second = this.p1;
	}
	
	// Entrambi i Puyo vengono controllati per verificare che ancora siano in movimento
	if (first != null){
		currentRow = Math.floor(first.Y / dim);
		
		// Se la posizione sottostante è occupata, il Puyo viene fermato
		if ((currentRow == ROWS - 1) || (grid[(currentRow + 1) * COLS + first.X] != null)){
			grid[currentRow * COLS + first.X] = first;
			first.div.style.border = 'none';
			this.direction == DOWN ? (this.p1 = null) : (this.p0 = null);
		}
		else {
			first.fall(speed, fastFall, dim);
			moved = true;	//aggiorno il valore di ritorno
		}
	}
	
	if (second != null){
		currentRow = Math.floor(second.Y / dim);
	
		if ((currentRow == ROWS - 1) || (grid[(currentRow + 1) * COLS + second.X] != null)){
			grid[currentRow * COLS + second.X] = second;
			second.div.style.border = 'none';
			this.direction == DOWN ? (this.p0 = null) : (this.p1 = null);
		}
		else {
			second.fall(speed, fastFall, dim);
			moved = true;
		}
	}
	
	// Se alla fine del movimento solo p1 sta continuando a muoversi,
	// il suo bordo viene evidenziato
	if (this.p0 == null && this.p1 != null) {
		this.p1.div.style.border = '1px dashed white';
	}
	
	return moved;	//true se almeno un puyo nella coppia si è mosso, false altrimenti
}

////////////////////////////////////////////////////////////////////////Funzione che controlla se un movimento orizzontale è possibile
Pair.prototype.possibleMovement = function(grid, puyo, step, dim){
	var currentRow = Math.floor(puyo.Y / dim);
	
	if (puyo.X + step < 0 ||																//Movimento fuori dal campo di gioco
		puyo.X + step >= COLS ||															//Movimento fuori dal campo di gioco
		grid[currentRow * COLS + puyo.X + step] != null ||									//Casella subito affianco occupata
		(currentRow < ROWS -1 && grid[(currentRow + 1) * COLS + puyo.X + step] != null)		//Casella affianco nella riga sotto occupata
	)
		return false;
	
	return true;
}

///////////////////////////////////////////////////////////////////////Funzione per il movimento orizzontale della coppia
Pair.prototype.jump = function(grid, dir_right, dim){
	var step = dir_right ? 1 : -1;
	
	//c'è solo p1
	if (this.p0 == null){
		if (this.possibleMovement(grid, this.p1, step, dim))
			this.p1.jump(step, dim);
	}
	
	//c'è solo p0
	else if (this.p1 == null){
		if (this.possibleMovement(grid, this.p0, step, dim))
			this.p0.jump(step, dim);
	}
	
	else {
		//affinchè il salto sia possibile per entrambi i puyo è sufficiente che lo sia
		//per il puyo "master", ovvero quello in basso in posizione verticale o quello
		//verso il quale si salta in posizione orizzontale
		var master, slave;
		
		if  (this.direction == UP ||					//p0 è sotto
			(this.direction == RIGHT && !dir_right) || 	//p0 è a sinistra e salto a sinistra
			(this.direction == LEFT && dir_right))		//p0 è a destra e salto a destra
		{
			master = this.p0;
			slave = this.p1;
		}
		else {
			master = this.p1;
			slave = this.p0;
		}
		
		if (this.possibleMovement(grid, master, step, dim)){
			master.jump(step, dim);
			slave.jump(step, dim);
		}
	}
}

/////////////////////////////////////////////////////////////////////////Funzione che controlla se un salto verdicale verso il basso è possibile
Pair.prototype.checkBelow = function(grid, puyo, dim){
	var currentRow = Math.floor(puyo.Y / dim);
	
	// Poichè currentRow è un'approssimazione per difetto, il Puyo controllato potrebbe star già 
	// occupando la casella nella riga sottostante, quindi è necessario controllare due righe sotto
	if (currentRow >= ROWS - 2 || grid[(currentRow + 2) * COLS + puyo.X])
		return false;
	
	return true;
}

/////////////////////////////////////////////////////////////////////////Funzione per la rotazione della coppia intorno a p0
Pair.prototype.rotate = function(grid, clockwise, dim){
	if (this.p0 == null || this.p1 == null)
		return;
	
	var step, nextDir;
	// Posizione verticale
	if (this.direction == UP || this.direction == DOWN) {
		if (this.direction == UP){
			step = clockwise ? 1 : -1;
			nextDir = clockwise ? RIGHT : LEFT;
		}
		else {
			step = clockwise ? -1 : 1;
			nextDir = clockwise ? LEFT : RIGHT;
		}
		
		if (this.possibleMovement(grid, this.p0, step, dim)){
			this.p1.jump(step, dim);
			this.p1.verticalJump((this.p0.Y - this.p1.Y) / dim, dim);
			this.direction = nextDir;
		}
	}
	// Posizione orizzontale
	else {
		if (this.direction == RIGHT){
			nextDir = clockwise ? DOWN : UP;
			step = clockwise ? 1 : -1;
		}
		else {
			nextDir = clockwise ? UP : DOWN;
			step = clockwise ? -1 : 1;
		}
			
		if (nextDir == DOWN && !this.checkBelow(grid, this.p0, dim))
			return;
			
		this.p1.jump(this.p0.X - this.p1.X, dim);
		this.p1.verticalJump(step, dim);
		this.direction = nextDir;
	}
}

/////////////////////////////////////////////////Funzione che viene usata a seguito del game over per la rimozione dei Puyo
Pair.prototype.destroy = function(playground){
	if (this.p0 != null){
		playground.removeChild(this.p0.div);
		delete this.p0;
		this.p0 = null;
	}
	if (this.p1 != null){
		playground.removeChild(this.p1.div);
		delete this.p1;
		this.p1 = null;
	}
}

/////////////////////////////////////////////////Funzione che scambia p0 e p1 per cambiare il polo di rotazione
Pair.prototype.changePivot = function(){
	if (this.p0 == null || this.p1 == null)
		return;
	
	var tmp = this.p0;
	this.p0 = this.p1;
	this.p1 = tmp;
	
	this.p0.div.style.border = '1px dashed white';
	this.p1.div.style.border = 'none';
	
	// Aggiornamento della direzione della coppia
	this.direction = (this.direction + 2) % 4;
}