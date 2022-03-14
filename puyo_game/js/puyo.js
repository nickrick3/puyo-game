// Costanti per i colori dei Puyo
const COLOR_NUMBER = 4;
const RED = 0;
const GREEN = 1;
const YELLOW = 2;
const BLUE = 3;

//Funzione per la conversione dei colori da numeri a stringhe
function convertColor(color){
	switch (color) {
		case RED: return 'red';
		case GREEN: return 'green';
		case YELLOW: return 'yellow';
		case BLUE: return 'blue';
		default: return 'red';
	}
}

//////////////////////////////////////////////////////////////OGGETTO PUYO

function Puyo(column, dimension) {
	this.X = column;										// colonna (da 0 a COLS-1)
	this.Y = 0;												// posizione verticale (da 0 a PUYO_DIM*(ROWS-1))
	this.color = Math.floor(Math.random() * COLOR_NUMBER);	// colore
	this.family = null;										// famiglia (ovvero il gruppo) di Puyo dello stesso colore a cui appartiene this
	this.collapsing = 0;									// quantità di pixel che il Puyo deve ancora percorrere durante un collasso di gruppi
	
	////// div che rappresenta il Puyo //////
	this.div = document.createElement('div');
	this.div.setAttribute('class', 'puyo');
	this.div.style.top = 0;
	this.div.style.width = dimension + 'px';
	this.div.style.height = dimension + 'px';
	this.div.style.left = (this.X * dimension) + 'px';
	
	////// immagine del Puyo //////
	this.div.innerHTML = "<img src='img/puyo" + dimension + "_" + this.color + ".png'" + " alt='X'>";
	
	////// colore della X in caso il browser non trovi l'immagine //////
	this.div.style.color = convertColor(this.color);
}

//////////////////////////////////////////////////////////////Caduta controllata dall'utente
Puyo.prototype.fall = function(speed, fastFall, dimension){
	if (!fastFall)
		this.Y += speed;		// Caduta con velocità normale
	else
		this.Y = Math.floor(this.Y / dimension + 1) * dimension;  //Caduta rapida
	this.div.style.top = this.Y + 'px';
}

//////////////////////////////////////////////////////////////Movimento orizzontale
Puyo.prototype.jump = function(step, dimension){
	this.X += step;
	this.div.style.left = (this.X * dimension) + 'px';
}

//////////////////////////////////////////////////////////////Movimento verticale non di caduta (a seguito di rotazione)
Puyo.prototype.verticalJump = function(step, dimension){
	this.Y += step * dimension;
	this.div.style.top = this.Y + 'px';
}

//////////////////////////////////////////////////////////////Caduta NON controllata (a seguito di collasso di famiglie)
Puyo.prototype.collapse = function(collSpeed){
	if (this.collapsing == 0)
		return false;
	
	this.Y += collSpeed;
	this.collapsing -= collSpeed;
	this.div.style.top = this.Y + 'px';
	return true;
}

//////////////////////////////////////////////////////////////Funzioni per ridimensionamento e aggiustamento della posizione
 
// A seguito di un ridimensionamento della finestra
Puyo.prototype.resizeSelf = function(oldDim, newDim){
	this.div.style.left = (this.X * newDim) + 'px';
	
	// Il Puyo viene riportato alla prima Y multipla di PUYO_DIM 
	// minore (o uguale) di quella in cui si trovava e collapsing viene
	// sistemato di conseguenza
	this.Y = Math.floor(this.Y / oldDim) * newDim;
	this.div.style.top = this.Y + 'px';
	
	this.collapsing = (Math.floor(this.collapsing / oldDim) + (this.collapsing % oldDim != 0 ? 1 : 0)) * newDim;
	
	this.div.style.width = newDim + 'px';
	this.div.style.height = newDim + 'px';
	this.div.innerHTML = "<img src='img/puyo" + newDim + "_" + this.color + ".png'" + " alt='X'>";
}

// A seguito del cambiamento di velocità
Puyo.prototype.adjustPosition = function(speed){
	this.Y = Math.floor(this.Y / speed) * speed;
	this.div.style.top = this.Y + 'px';
}