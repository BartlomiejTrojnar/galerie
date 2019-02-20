<?php
/* skrypt zawierający często używane funkcje w systemie */
/* (C) mgr inż. Bartłomiej Trojnar; (III) październik 2016 */
//ustanowienie połączenia z MySQL
@ $polacz = mysql_connect('localhost', 'bartektr_admin', 'ARla575mowHO');
//jeżeli połączono - wybór bazy danych
if($polacz) {
    mysql_query('SET CHARACTER SET latin2;');
    mysql_query('SET collation_connection = latin2_general_ci;');
    mysql_query('SET character_set_connection=utf8');
    mysql_query('SET character_set_client=utf8');
    mysql_query('SET character_set_results=utf8');
	mysql_select_db("bartektr_galerie");
}
else {
	unset($_SESSION['login']);
	header('Location: index.php');
	exit;
}

error_reporting( E_ALL );

//utworzenie nagłówka strony internetowej (nagłówek i początek ciała);
function naglowek_HTML($tytul='', $skrypt='') {
	print '<!DOCTYPE html>';
	print '<html lang="pl-PL"><head>';
	printf('<title>%s</title>', $tytul);
	print '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
	//dołączenie plików ze stylami dla strony
	print "<link href='http://fonts.googleapis.com/css?family=Glass+Antiqua|Magra&subset=latin-ext' rel='stylesheet' type='text/css'>";
	printf('<link rel="stylesheet" type="text/css" href="/bazy/galerie/css/style.css" />');
	print '<script type="text/javascript" charset="utf-8" src="/bazy/jquery.min.js"></script>';
	if($skrypt) {
		printf('<script type="text/javascript" src="/bazy/galerie/js/%s.js"></script>', $skrypt);
		printf('<link rel="stylesheet" type="text/css" href="/bazy/galerie/css/%s.css" />', $skrypt);
	}
	else
	print '<script type="text/javascript" src="/bazy/galerie/js/funkcje.js"></script>';
	print '</head><body>';
}

//utworzenie zakończenia dla strony HTML
function zakoncz_HTML() {
	print '<footer><p>&copy; Bartłomiej Trojnar 2012, projekt graficzny: Jan Żurawski</p></footer>';
	print '</body></html>';
}
?>