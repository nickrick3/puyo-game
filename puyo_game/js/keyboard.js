function keyHandler(event) {
	switch (event.keyCode) {
		case 27:	//ESC
			if (game.isStarted)
				(game.gameClock == null) ? game.resume() : game.pause();
			return;
		case 37:	//FRECCIA SINISTRA
			game.jumpCommand(false);
			return;
		case 39:	//FRECCIA DESTRA
			game.jumpCommand(true);
			return;
		case 40:	//FRECCIA IN BASSO
			game.fastFall = true;
			return;
		case 65: 	//A
			game.rotateCommand(false);
			return;
		case 68:	//D
			game.rotateCommand(true);
			return;
		case 77:	//M
			game.mute_unmute();
			return;
		case 87:	//W
			game.swapCommand();
			return;
		default: return;
	}
}

function keyHandlerUp (event) {
	if (event.keyCode == 40)
		game.fastFall = false;
}