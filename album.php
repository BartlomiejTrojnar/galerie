<?php
/* plik znajdujący albumy w kolekcji */
/* (C) mgr inż. Bartłomiej Trojnar; (II) lipiec 2015 */
//dołączenie plików z obsługą klas oraz wystartowanie sesji
//session_start();
require_once('config.php');

//pobieranie danych albumu
if(isset($_GET['idalbumu']))	$idalbumu = $_GET['idalbumu'];	else $idalbumu = 100;
$query = "SELECT * FROM albumy WHERE idalbumu=$idalbumu";
$result= mysql_query($query);
$album = mysql_fetch_array($result);

//pobieranie danych kolekcji
$query = "SELECT * FROM kolekcje WHERE idkolekcji=". $album['idkolekcji'];
$result= mysql_query($query);
$kolekcja = mysql_fetch_array($result);

$naglowek = "Album: ". $album['nazwa'];
$katalog = "/images/galerie/". $kolekcja['nazwa'] ."/". $album['folder'];


//nagłówek strony
naglowek_HTML($naglowek, 'album');
print '<header>';

//wyświetlenie miniaturek zdjęć
print '<nav>';
for($i=1; $i<=$album['ilosc']; $i++) {
	$p=$i;
	if($p<100) $p='0'.$p;
	if($p<10) $p='0'.$p;

	print "\n";
	printf('<div><a class="" href="#" rel="%d">', $i);
	printf('<img src="%s" alt="%s" title="%s" />', "$katalog/240/$p.jpg", 'alt', 'title');
	print('</a></div>');
}
print '</nav>';
printf('<p id="dlugosc">%d</p>', $album['ilosc']);
//printf('<p id="MiniSzerokosc">%d</p>', $album['ilosc']*150);

print '<aside id="strzalka_l"><div><img src="css/strzalka_l0.png" alt="" /></div><div class="nak"></div></aside>';
print '<aside id="strzalka_p"><div><img src="css/strzalka_p1.png" alt="" /></div><div class="tlo"></div></aside>';
print '</header>';

print '<section id="pokaz">';
print '<div id="strzalka_l2"><div><img src="css/strzalka_l0.png" alt="" /></div><div class="nak"></div></div>';
print "<div id='zdjecia'>\n";
	wyswietl($kolekcja, $album);
print "\n</div>";
print '<div id="strzalka_p2"><div><img src="css/strzalka_p1.png" alt="" /></div><div class="tlo"></div></div>';
print '<aside id="podpis"></aside></section>';

print ('<progress id="liczmale" max="100" value="0">zdjęcia małe</progress>');
print ('<progress id="liczduze" max="100" value="0">zdjęcia duże</progress>');


//inne informacje
hiperlacza($kolekcja['idkolekcji'], $kolekcja['nazwa']);
//utworzenie zakończenia HTML-owego strony
zakoncz_HTML();


//wyświetlenie zdjęcia
function wyswietl($kolekcja, $album) {
	$idalbumu = $album['idalbumu'];
	$query = "SELECT idzdjecia, numer, autor, szerokosc, wysokosc, opis, data ";
	$query.= "FROM zdjecia WHERE idalbumu=$idalbumu ORDER BY numer";
	$result= mysql_query($query);
	$i=0;
	while($row = mysql_fetch_array($result)) {
		$nr = $row['numer'];	$i++;
		$z = '<div id="zdj'.$nr.'">';
		if($nr<10) $nr = "00".$nr.".jpg"; elseif ($nr<100) $nr="0".$nr.".jpg"; else $nr .= ".jpg";
		$z .= '<a class="zdjecie" href="zdjecie.php?album='.$idalbumu.'&amp;plik='.$nr.'" rel="'. $i .'">';
		$adres = "/images/galerie/". $kolekcja['nazwa'] ."/". $album['folder'] ."/800/$nr";
		$z .= '<img src="'.$adres.'" alt="" /></a>';
		$z .= '<h2>'. $row['opis'] .'</h2>';
		$data = formatuj_date($row['data']);
		$z .= '<p class="autor">fot.: '.$row['autor'].$data .'</p>';
		$z .= '<p class="szerokosc">'.$row['szerokosc'].'</p>';
		$z .= '<p class="wysokosc">'.$row['wysokosc'].'</p>';
		$z .= '</div>';
		print $z;
	}
}

function formatuj_date($d) {
	$w = "; ".substr($d, 0, 4) ."-". substr($d, 5, 2) ."-". substr($d, 8, 2);
	$w .= " o godzinie: ". substr($d, 11, 5);
	return $w;
}

//utworzenie menu dla strony z kolekcją
function hiperlacza($id, $kolekcja) {
	print '<nav><ul id="gl">';
	print '<li><div><a href="/">strona główna</a></div></li>';
	print '<li><div><a href="/bazy/galerie">wszystkie galerie</a></div></li>';
	printf('<li><div><a href="/bazy/galerie/kolekcja.php?idkolekcji=%s">rok %s/%s</a></div></li>', $id, $kolekcja-1, $kolekcja);
	print '</ul>';

	print '<header><img class="g0" src="css/strzalka_g0.png" alt="" />';
	print '<img class="g1" src="css/strzalka_g1.png" alt="" /><div class="nak"></div></header>';

	print '<ul id="ig">';
	$query = "SELECT idalbumu, nazwa, folder, ilosc, idkolekcji FROM albumy WHERE idkolekcji=$id ORDER BY idalbumu DESC";
	$result= mysql_query($query);
	if(!mysql_num_rows($result)) print '<li>brak albumów</li>';
	while($album = mysql_fetch_array($result)) {
		printf('<li><div><a href="album.php?idalbumu=%d">', $album['idalbumu']);
		printf('%s</a></div></li>', $album['nazwa']);
	}
	print '</ul>';

	print '<footer><img class="d0" src="css/strzalka_d0.png" alt="" />';
	print '<img class="d1" src="css/strzalka_d1.png" alt="" /><div class="tlo"></div></footer>';

	print '</nav>';
}
?>