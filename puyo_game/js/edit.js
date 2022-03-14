function validateForm (){
	var errorMessage = document.getElementById("error");
	
	if (!/^[A-Za-z0-9\-_]{8,}$/.test(document.forms.edit.elements.password.value)){
		errorMessage.firstChild.nodeValue = "La password deve contenere almeno 8 caratteri alfanumerici (sono ammessi anche - e _)";
		errorMessage.style.display = "block";
		return false;
	}

	if(document.forms.edit.elements.password.value != document.forms.edit.elements.password_repeat.value){
		errorMessage.firstChild.nodeValue = "Le due password non combaciano";
		errorMessage.style.display = "block";
		return false;
	}

	errorMessage.style.display = "none";
	return true;
}
