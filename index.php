<?php
/* skrypt startowy dla galerii */
/* (C) mgr inż. Bartłomiej Trojnar; (I) sierpień 2015 */
//wystartowanie sesji oraz dołączenie pliku konfiguracyjnego
session_start();
require_once('config.php');

//utworzenie nagłówka strony
naglowek_HTML('Galerie zdjęć Zespołu Szkół Nr 1 im. Janusza Korczaka w Łańcucie', 'start');
//utworzenie głównej części strony
print '<header id="page_header">';
print '<div id="start"><a href="/">strona główna</a></div>';
print '<div id="version"><p id="c1">Galerie 2LO<br />kontakt</p>';
print '<p id="c2">mgr inż. Bartłomiej Trojnar<br />gadu-gadu 6964849<br />e-mail: bartek_tr@tlen.pl</p></div>';

print '<p>Galeria Zespołu Szkół Nr 1 im. Janusza Korczaka w Łańcucie</p>';
print '</header>';
print '<section id="albumy">';
	//wstawienie kolekcji
	$query = "SELECT idkolekcji, nazwa FROM kolekcje ORDER BY idkolekcji DESC";
	$result= mysql_query($query);
	$i=0; $max=0; $min=9999999; $maxn = 0; $minn = '';
	while($kolekcja = mysql_fetch_array($result)) {
		wyswietl_kolumne_kolekcji($kolekcja['idkolekcji'], $kolekcja['nazwa'], $i*200);
		if($max < $kolekcja['idkolekcji'])	{ $max=$kolekcja['idkolekcji']; $maxn = $kolekcja['nazwa']; }
		if($min > $kolekcja['idkolekcji'])	{ $min=$kolekcja['idkolekcji']; $minn = $kolekcja['nazwa']; }
		$i++;
	}
	printf('<p id="pierwszy" style="display: none;">%s</p>', $minn);
	printf('<p id="ostatni" style="display: none;">%s</p>', $maxn);
print '</section>';

//elementy sterujące
print '<aside id="strzalka_l"><img class="l0" src="css/strzalka_l0.png" alt="" /><img class="l1" src="css/strzalka_l1.png" alt="" /><div></div></aside>';
print '<aside id="strzalka_p" class="aktywny"><img class="p0" src="css/strzalka_p0.png" alt="" /><img class="p1" src="css/strzalka_p1.png" alt="" /><div></div></aside>';

//utworzenie zakończenia HTML-owego strony
zakoncz_HTML();

// wyświetlenie kolumn z kolejnymi kolekcjami
function wyswietl_kolumne_kolekcji($id, $kolekcja, $left=0) {
	printf('<div class="column k%s" style="left: %dpx;">', $kolekcja, $left);
	printf('<h1><a href="kolekcja.php?idkolekcji=%s">%s</a></h1>', $id, $kolekcja);
	printf('<header id="gora%s">', $kolekcja);
	print ('<img class="g0" src="css/strzalka_g0.png" alt="" /><img class="g1" src="css/strzalka_g1.png" alt="" />');
	printf('<p>%s</p><div class="nak"></div></header>', $kolekcja);

	print '<ul>';
	$query = "SELECT idalbumu, nazwa, folder, ilosc, idkolekcji FROM albumy WHERE idkolekcji=$id ORDER BY data DESC, idalbumu DESC";
	$result= mysql_query($query);
	if(!mysql_num_rows($result)) print '<li>brak albumów</li>';
	while($row = mysql_fetch_array($result)) {
		printf('<li><div><a href="album.php?idalbumu=%d">', $row['idalbumu']);
		printf('%s</a></div></li>', $row['nazwa']);
	}
	print '</ul>';

	printf('<footer id="dol%s">', $kolekcja);
	print ('<img class="d0" src="css/strzalka_d0.png" alt="" /><img class="d1" src="css/strzalka_d1.png" alt="" />');
	printf('<p>%s</p><div class="tlo"></div></footer>', $kolekcja, $kolekcja);
	print '</div>';
}
?>