<?php
/* plik znajdujący albumy w kolekcji */
/* (C) mgr inż. Bartłomiej Trojnar; (I) sierpień 2015 */
//dołączenie plików z obsługą klas oraz wystartowanie sesji
session_start();
require_once('config.php');

$idkolekcji = $_GET['idkolekcji'];
$query = "SELECT nazwa FROM kolekcje WHERE idkolekcji=$idkolekcji";
$result= mysql_query($query);
$row = mysql_fetch_array($result);
$rok = $row[0];

//utworzenie nagłówka strony
$naglowek = "Galerie - rok szkolny ". ($rok-1) ."/$rok";
naglowek_HTML($naglowek, 'kolekcja');

print '<header id="page_header">';
print '<h2 id="r1"><a href="/">strona główna</a></h2>';
print '<h2 id="r2"><a href="/bazy/galerie">wszystkie galerie</a></h2>';
printf('<h1>%s</h1>', $naglowek);
print '</header>';

//utworzenie głównej części strony
print '<section id="albumy">';
znajdz_albumy($idkolekcji, $rok);
print '</section>';

//elementy sterujące
print '<aside id="strzalka_l"><div><img src="css/strzalka_l0.png" alt="" /></div><div class="nak"></div></aside>';
print '<aside id="strzalka_p"><div><img src="css/strzalka_p1.png" alt="" /></div><div class="tlo"></div></aside>';

//znalezienie ostatniej kolekcji
$query = "SELECT max(idkolekcji) FROM kolekcje";
$result= mysql_query($query);
$max = mysql_fetch_array($result);
printf('<p id="ostatnia_kolekcja" style="display: none;">%d</p>', $max[0]);

//utworzenie zakończenia HTML-owego strony
zakoncz_HTML();

//funkcja przeszukująca katalog z galeriami
function znajdz_albumy($idkolekcji, $nazwa) {
	$query = "SELECT * FROM albumy WHERE idkolekcji=$idkolekcji ORDER BY data, idkolekcji";
	$result= mysql_query($query);
	while($row = mysql_fetch_array($result)) {
		//$m = $row['miniat'];
		$m=1;
		if($m<100) $m='0'.$m;
		if($m<10) $m='0'.$m;
		$src = "/images/galerie/". $nazwa ."/". $row['folder']."/240/".$m.".jpg";
		printf('<a class="album" href="album.php?idalbumu=%d">', $row['idalbumu']);
		print ('<table><tr>');
		printf('<td rowspan="2" class="image"><img src="%s" alt="%s" /></td>', $src, $row['nazwa']);
		printf('<td class="podpis">%s</td>', $row['nazwa']);
		print ('</tr><tr>');
		printf('<td class="licznik">%d zdjęć</td></tr></table></a>', $row['ilosc']);
	}
}
?>