<?php
define("ITEMS_PER_PAGE", 15);
class DBHelper{
	private $mysqli;

	function __construct(){
		$this->mysqli = new mysqli('localhost', 'root', '', 'puyo');

		if ($this->mysqli->connect_error) {
		die('Connect Error (' . $this->mysqli->connect_errno . ') '. $this->mysqli->connect_error);
		}
	}

	public function close(){
		$this->mysqli->close();
	}

	// effettua il login con $username e $password e ritorna 0 in caso di successo
	// 1 in caso di username non trovato e 2 in caso di password errata
	public function login($username, $password){
		$stmt = $this->mysqli->prepare("SELECT email, password FROM users WHERE username = ?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();
		if($result->num_rows == 0){
			$result->close();
			$stmt->close();
			return 1;
		}
		while($row = $result->fetch_assoc()) {
			if (password_verify($password, $row['password'])){
				$_SESSION['login'] = true;
				$_SESSION['username'] = $username;
				$_SESSION['email'] = $row['email'];

				$result->close();
				$stmt->close();
				return 0;
			} else{
				$result->close();
				$stmt->close();
				return 2;
			}
		}
	}

	// registra l'utente salvando nel database nome utente e hash della password
	// ritorna 0 se l'inserimento è avvenuto con successo, 1 se l'utente esiste già, 2 se l'email  già stata usata, 3 per altri errori
	public function register($username, $email, $password){
		// Controlla che non ci siano già utenti con quell'username.
		$stmt_select_username = $this->mysqli->prepare("SELECT * FROM users WHERE username = ?");
		$stmt_select_username->bind_param("s", $username);
		$stmt_select_username->execute();
		$result_username = $stmt_select_username->get_result();
		$rows_username = $result_username->num_rows;
		$result_username->close();
		$stmt_select_username->close();
		if($rows_username != 0){ // Esiste già uno con lo stesso username
			return 1;
		}

		// Controlla che non ci siano già utenti con quell'email.
		$stmt_select_email = $this->mysqli->prepare("SELECT * FROM users WHERE email = ?");
		$stmt_select_email->bind_param("s", $email);
		$stmt_select_email->execute();
		$result_email = $stmt_select_email->get_result();
		$rows_email = $result_email->num_rows;
		$result_email->close();
		$stmt_select_email->close();
		if($rows_email != 0){ // Esiste già uno con la stessa email
			return 2;
		}

		$hash = password_hash($password, PASSWORD_BCRYPT);
		$stmt = $this->mysqli->prepare("INSERT INTO users(username, email, password) VALUE(?, ?, ?)");
		$stmt->bind_param("sss", $username, $email, $hash);
		$success = $stmt->execute();
		$stmt->close();
		if($success){
			$_SESSION['login'] = true;
			$_SESSION['username'] = $username;
			$_SESSION['email'] = $email;
			return 0;
		} else return 3;
	}

	// modifica la password di $username. Ritorna false in caso di errore, true altrimenti
	public function editPassword($username, $password){
		$hash = password_hash($password, PASSWORD_BCRYPT);
	
		$stmt = $this->mysqli->prepare("UPDATE users SET password = ? WHERE username = ?");
		$stmt->bind_param("ss", $hash, $username);
		$success = $stmt->execute();
		$stmt->close();

		return $success;
	}

	// elimina l'account $username. Ritorna false in caso di errore, true altrimenti
	public function deleteAccount($username){
		$stmt = $this->mysqli->prepare("DELETE FROM users WHERE username = ?");
		$stmt->bind_param("s", $username);
		$success = $stmt->execute();
		$stmt->close();

		return $success;
	}

	// carica le statistiche di $username
	// ritorna false in caso di errore, true in caso di successo
	public function loadStats($username){
		$stmt = $this->mysqli->prepare("SELECT highscore, avgscore, best_time, avgtime FROM users WHERE username = ?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();
		if($result->num_rows == 0){
			$result->close();
			$stmt->close();
			return false;
		}
		while($row = $result->fetch_assoc()) {
			$_SESSION['highscore'] = $row['highscore'];
			$_SESSION['best_time'] = $row['best_time'];
			$_SESSION['avgscore'] = $row['avgscore'];
			$_SESSION['avgtime'] = $row['avgtime'];

			$result->close();
			$stmt->close();
			return true;
		}
	}

	// inserisce il nuovo punteggio e il nuovo tempo e ritorna true in caso di successo,
	// false in caso di errore
	public function insertResults($username, $score, $time){
		$stmt_insert = $this->mysqli->prepare("INSERT INTO scores(player, score, time) VALUE(?, ?, ?)");
		$stmt_insert->bind_param("sii", $username, $score, $time);
		$success = $stmt_insert->execute();
		$stmt_insert->close();

		return $success;
	}

	// ritorna la classifica per $field
	public function getRanking($page_n, $field){
		if (!in_array($field, array('highscore', 'avgscore', 'best_time', 'avgtime')))
			return array();
		if (!is_int($page_n) || $page_n<0)
			return array();

		$offset = $page_n*ITEMS_PER_PAGE;
		$query = "SELECT username, {$field} AS score FROM users WHERE {$field} > 0 ORDER BY {$field} DESC LIMIT ".ITEMS_PER_PAGE." OFFSET {$offset}";
		$result = $this->mysqli->query($query);

		$array = array();
		while($row = $result->fetch_assoc()) {
			$array[] = array('player' => $row['username'], 'score' => $row['score']);
		}
		$result->close();
		return $array;
	}

	// ottiene il numero di pagine per il field selezionato
	public function getNumberOfPagesRanking($field){
		if (!in_array($field, array('highscore', 'avgscore', 'best_time', 'avgtime')))
			return array();
		$result = $this->mysqli->query("SELECT COUNT(*) AS n FROM users WHERE {$field} > 0");
		if($result->num_rows == 0){
			$result->close();
		return 0;
		}
		while($row = $result->fetch_assoc()) {
			return ceil($row['n']/ITEMS_PER_PAGE);
		}
		// non dovrebbe mai arrivare qui...
		return 0;
	}

	// ottiene la cronologia delle partite dell'utente $player
	public function getHistory($player, $page_n){
		if (!is_int($page_n) || $page_n<0)
			return array();

		$offset = $page_n*ITEMS_PER_PAGE;
		$query = "SELECT UNIX_TIMESTAMP(timestamp) AS ts, score, time FROM scores WHERE player = '{$player}' ORDER BY timestamp DESC LIMIT ".ITEMS_PER_PAGE." OFFSET {$offset}";
		$result = $this->mysqli->query($query);

		$array = array();
		while($row = $result->fetch_assoc()) {
			$array[] = array('timestamp' => $row['ts'], 'score' => $row['score'], 'time' => $row['time']);
		}
		$result->close();
		return $array;
	}

	// ottiene quante partite ha fatto $player
	public function getNumberOfGames($player){
		$result = $this->mysqli->query("SELECT COUNT(*) AS n FROM scores WHERE player = '{$player}'");
		if($result->num_rows == 0){
			$result->close();
			return 0;
		}
		while($row = $result->fetch_assoc()) {
			return $row['n'];
		}
		// non dovrebbe mai arrivare qui...
		return 0;
	}

	// ottiene il numero di pagine per la cronologia di $player
	public function getNumberOfPagesHistory($player){
		return ceil($this->getNumberOfGames($player)/ITEMS_PER_PAGE);
	}

	// ottiene la posizione in classifica di $player rispetto al campo $field
	public function getRankPosition($player, $field){
		if (!in_array($field, array('highscore', 'avgscore', 'best_time', 'avgtime')))
			return 0;

		$query = "SELECT COUNT(DISTINCT {$field})+1 AS pos FROM users WHERE {$field} > (SELECT {$field} FROM users WHERE username = '{$player}')";
		$result = $this->mysqli->query($query);

		if($result->num_rows == 0){
			$result->close();
			return 0;
		}
		while($row = $result->fetch_assoc()) {
			return $row['pos'];
		}
		// non dovrebbe mai arrivare qui...
		return 0;
	}
}
 ?>
