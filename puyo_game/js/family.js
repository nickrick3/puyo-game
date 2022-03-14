////////////////////////////////////////////Oggetto Family, ovvero un gruppo di Puyo dello stesso colore e adiacenti
function Family(){
	this.membersList = new Array();
	this.sound = new Audio("audio/pop.ogg");	// Rumore da fare allo scoppio della famiglia
}

Family.prototype.addMember = function(puyo){
	this.membersList.push(puyo);
	puyo.family = this;
}

Family.prototype.popMember = function(){
	if (this.membersList.length > 0){
		var puyo = this.membersList.pop();
		puyo.family = null;
		return puyo;
	}
	return null;
}