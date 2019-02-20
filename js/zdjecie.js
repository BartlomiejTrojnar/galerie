/* obsługa pokazu dla średnich zdjeć w albumie */
/* (C) mgr inż. Bartłomiej Trojnar; (III) czerwiec 2014 */
var zdjecie = 1;
var sciezka, ilosc;

// obsługa zdarzenia kliknięcia w strzałkę w lewo
function klik_lewy() {
	zdjecie--;
	if(zdjecie<1) zdjecie=ilosc;
	pokaz_zdjecie();
}

// obsługa zdarzenia kliknięcia w strzałkę w prawo
function klik_prawy() {
	zdjecie++;
	if(zdjecie>ilosc) zdjecie=1;
	pokaz_zdjecie();
}

// pokazanie aktualnego zdjęcia
function pokaz_zdjecie() {
	var plik;
	if(zdjecie<10)		plik = sciezka + '00' + zdjecie + '.jpg';
	else if(zdjecie<100)plik = sciezka + '0' + zdjecie + '.jpg';
	else				plik = sciezka + zdjecie + '.jpg';
	$('img#foto').attr('src', plik);
}


///////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
	zdjecie = $('#nr_zdjecia').html();
	sciezka = $('#sciezka').html();
	ilosc = $('#ilosc').html();
	//obsługa lewej strzałki - poprzednie zdjęcie
	$('#strzalka_l').bind('click',	function() {	klik_lewy();	});
	//obsługa prawej strzałki - następne zdjęcie
	$('#strzalka_p').bind('click',	function() {	klik_prawy();	});
});