/* obsługa strony głównej galerii */
/* (C) mgr inż. Bartłomiej Trojnar; (I) sierpień 2015 */

var OSTATNI = 15;
var idkolekcji = OSTATNI;
var src = "kolekcja.php?idkolekcji=";

// obsługa zdarzenia kliknięcia w strzałkę w lewo
function klik_lewy() {
	idkolekcji++;
	if (idkolekcji>OSTATNI) idkolekcji=OSTATNI;
	src += idkolekcji;
	window.open(src, "_parent");
}
// obsługa zdarzenia kliknięcia w strzałkę w prawo
function klik_prawy() {
	idkolekcji--;
	if (idkolekcji<1) idkolekcji=1;
	src += idkolekcji;
	window.open(src, "_parent");
}

//narysowanie strzałek do przesuwania paska
function strzalka_l(aktywna) {
	if(aktywna) {
		$('aside#strzalka_l img').attr('src', "css/strzalka_l1.png");
		$('aside#strzalka_l div.nak').addClass('tlo');
		$('aside#strzalka_l div.nak').removeClass('nak');
	}
	else {
		$('aside#strzalka_l img').attr('src', "css/strzalka_l0.png");
		$('aside#strzalka_l div.tlo').addClass('nak');
		$('aside#strzalka_l div.tlo').removeClass('tlo');
	}
}

function strzalka_p(aktywna) {
	if(aktywna) {
		$('aside#strzalka_p img').attr('src', "css/strzalka_p1.png");
		$('aside#strzalka_p div.nak').addClass('tlo');
		$('aside#strzalka_p div.nak').removeClass('nak');
	}
	else {
		$('aside#strzalka_p img').attr('src', "css/strzalka_p0.png");
		$('aside#strzalka_p div.tlo').addClass('nak');
		$('aside#strzalka_p div.tlo').removeClass('tlo');
	}
}

function SzerAlbumy() {		//obliczenie wysokości sekcji z albumami
	var w = $("#albumy").css('width');
	w = parseInt(w.substr(0, w.length-2));
	return w;
}

function DopasujSzerokoscAlbumu() {		//dopasowanie szerokości odnośnika z albumem
	var szerokosc = SzerAlbumy();		//pobranie szerokości sekcji z albumami
	if(szerokosc<550)						szerokosc -= 20;
	if(szerokosc>=550 && szerokosc < 800)	szerokosc = (szerokosc-40-2)/2;
	if(szerokosc>=800 && szerokosc < 1060)	szerokosc = (szerokosc-50-3)/3;
	if(szerokosc>=1060 && szerokosc < 1400)	szerokosc = (szerokosc-55-4)/4;
	if(szerokosc>=1400)						szerokosc = (szerokosc-60-5)/5;
	$("a.album").css('width', szerokosc);
}


///////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
	OSTATNI = $('#ostatnia_kolekcja').text();
	idkolekcji = $('#page_header h1').text();
	idkolekcji = parseInt(idkolekcji.substr(-4, 4))-2003;
	if(idkolekcji<=1) strzalka_p(0); else strzalka_p(1);
	if(idkolekcji>=OSTATNI) strzalka_l(0); else strzalka_l(1);
	DopasujSzerokoscAlbumu();

	//obsługa lewej strzałki - przesuwanie paska w lewo
	$('#strzalka_l').bind('click',	function() {	klik_lewy();	});
	//obsługa prawej strzałki - przesuwanie paska w prawo
	$('#strzalka_p').bind('click',	function() {	klik_prawy();	});
	//obsługa zmiany rozmiaru okna
	$(window).resize(DopasujSzerokoscAlbumu);
});