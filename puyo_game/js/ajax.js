// Invia il punteggio al server
function sendResults(score, time){
	try { xmlHttp=new XMLHttpRequest(); }
	catch (e) {
		try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
		//IE (recent versions)
		catch (e) {
			try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			//IE (older versions)
			catch (e) {
				window.alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.open("POST","new_score.php",true);
	xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlHttp.onreadystatechange = function(){
		if (xmlHttp.readyState == 4){
			if (xmlHttp.responseText != 'ok'){
				window.alert("C'è stato un problema nell'upload del punteggio: " + xmlHttp.responseText);
			}
		}
	};
	xmlHttp.send("score="+score+"&time="+time);
}
