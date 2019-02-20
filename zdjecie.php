<?php
/* plik znajdujący albumy w kolekcji */
/* (C) mgr inż. Bartłomiej Trojnar; (I) październik 2015 */
//dołączenie plików z obsługą klas oraz wystartowanie sesji
session_start();
require_once('config.php');

//utworzenie nagłówka strony
if(isset($_GET['album']))	$idalbumu	= $_GET['album'];	else $idalbumu = 100;
if(isset($_GET['plik']))	$zdjecie	= $_GET['plik'];	else $zdjecie = 1;
$naglowek = "Zdjęcie ".$zdjecie;
naglowek_HTML($naglowek, 'zdjecie');

//pobieranie danych albumu
$query = "SELECT * FROM albumy WHERE idalbumu=$idalbumu";
$result= mysql_query($query);
$album = mysql_fetch_array($result);
//pobieranie danych kolekcji
$query = "SELECT * FROM kolekcje WHERE idkolekcji=". $album['idkolekcji'];
$result= mysql_query($query);
$kolekcja = mysql_fetch_array($result);
//wyświetlenie zdjęcia
$src = "/images/galerie/".$kolekcja['nazwa']."/".$album['folder']."/2048/".$zdjecie;
printf('<img id="foto" src="%s" alt="%s" />', $src, substr($zdjecie, 0, 3));


//elementy sterujące
print '<aside id="strzalka_l"><div><img src="css/strzalka_l1.png" alt="" /></div><div class="nak"></div></aside>';
print '<aside id="strzalka_p"><div><img src="css/strzalka_p1.png" alt="" /></div><div class="tlo"></div></aside>';

printf('<p id="sciezka">%s</p>', "/images/galerie/".$kolekcja['nazwa']."/".$album['folder']."/2048/");
printf('<p id="ilosc">%d</p>', $album['ilosc']);
printf('<p id="nr_zdjecia">%d</p>', $zdjecie);
//utworzenie zakończenia HTML-owego strony
zakoncz_HTML();
?>