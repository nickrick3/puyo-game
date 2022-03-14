function validateForm (){
	var errorMessage = document.getElementById("error");
  
	if (!/^[A-Za-z0-9]{4,}$/.test(document.forms.login.elements.username.value)){
		errorMessage.firstChild.nodeValue = "L'username deve contenere almeno 4 caratteri alfanumerici";
		errorMessage.style.display = "block";
		return false;
	}

	if (!/^[A-Za-z0-9]{8,}$/.test(document.forms.login.elements.password.value)){
		errorMessage.firstChild.nodeValue = "La password deve contenere almeno 8 caratteri alfanumerici";
		errorMessage.style.display = "block";
		return false;
	}

	errorMessage.style.display = "none";
	return true;
}
