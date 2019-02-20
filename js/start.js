/* obsługa strony głównej galerii */
/* (C) mgr inż. Bartłomiej Trojnar; (I) sierpień 2015 */

var PIERWSZY, OSTATNI;		//pierwszy i ostatni rocznik (kolekcja) zdjęć
var MarginesLewy = 0;		//określenie lewego marginesu kolumny najnowszego rocznika
var MAX_MARGIN=205;			//maksymalny możliwy margines
var SZEROKOSC;				//szerokość kolumny rocznika (obliczana po załadowaniu strony)
var wysPOZYCJI;				//wysokość elementu na liście

function klik_lewy() {		//obsługa zdarzenia kliknięcia w strzałkę w lewo
	var szerokosc = SzerAlbumy();	//obliczenie szerokości sekcji Albumów
	var kolumny = (szerokosc-130 - (szerokosc-130) % (SZEROKOSC+10));	//ilość całych kolumn

	//obliczenie marginesu
	//jeżeli margines nie jset wielokrotnością szerokości kolumny
	if(MarginesLewy < -(OSTATNI-PIERWSZY)*(SZEROKOSC+10)+kolumny) MarginesLewy = -(OSTATNI-PIERWSZY+1)*(SZEROKOSC+10)+kolumny;
	//zwiększenie marginesu o obliczoną szerokość całych kolumn
	MarginesLewy += kolumny;
	//jeżeli margines jest zbyt duży
	if(MarginesLewy >= 0) MarginesLewy=0;
	//zmiana położenia kolumn z albumami
	for(k=OSTATNI; k>=PIERWSZY; k--)
		$('div.k'+k).animate({'left':MarginesLewy+(OSTATNI-k)*(SZEROKOSC+10)}, 500);
	//ustawienie strzałek
	strzalka_l();strzalka_p();
}

function klik_prawy() {		//obsługa zdarzenia kliknięcia w strzałkę w prawo
	var szerokosc = SzerAlbumy();	//obliczenie szerokości sekcji Albumów
	var kolumny = (szerokosc-130 - (szerokosc-130) % (SZEROKOSC+10));	//szerokosc całych kolumn
	//dopasowanie początkowego marginesu do prawej krawędzi
	if(MarginesLewy > (szerokosc-152-190)-kolumny) MarginesLewy = (szerokosc-152-190)-kolumny+200;
	//obliczenie marginesu
	MarginesLewy -= kolumny;
	if(MarginesLewy <= -(OSTATNI-PIERWSZY)*200+(szerokosc-152-190))
		MarginesLewy = -(OSTATNI-PIERWSZY)*200+(szerokosc-152-190);

	//zmiana położenia kolumn z albumami
	for(k=OSTATNI; k>=PIERWSZY; k--)
		$('div.k'+k).animate({'left':MarginesLewy+(OSTATNI-k)*(SZEROKOSC+10)}, 500);
	//ustawienie strzałek
	strzalka_l();strzalka_p();
}

function klik_dol(k) {		//obsługa zdarzenia kliknięcia w strzałkę w dół
	var przesuniecie = ObliczPrzesuniecie(k);	//obliczenie przesuniecia elementów
	ZmienWysokoscListy(k, przesuniecie);		//znalezienie i zmiania wysokości listy
	ZmienPolozenieListy(k, -przesuniecie);		//znalezienie i zmiana górnego położenia listy
}

function klik_gora(k) {		//obsługa zdarzenia kliknięcia w strzałkę w górę
	var przesuniecie = ObliczPrzesuniecie(k);	//obliczenie przesuniecia elementów
	ZmienPolozenieListy(k, przesuniecie);		//znalezienie i zmiana górnego położenia listy
	ZmienWysokoscListy(k, -przesuniecie);		//znalezienie i zmiania wysokości listy
}

function ObliczPrzesuniecie(k) {	//znalezienie wysokości widocznej części listy - wartości o którą należy ją przesunąć
	var przesuniecie = $("div.k"+k).css('height');
	przesuniecie = parseInt(przesuniecie.substr(0, przesuniecie.length-2))-153;
	przesuniecie = przesuniecie - (przesuniecie % wysPOZYCJI);
	if(przesuniecie<51) przesuniecie = 51;
	return przesuniecie;
}

function strzalka_d(k, aktywna) {		//narysowanie dolnej strzałki do przesuwania listy w kolumnie k
	if(aktywna) {		//aktywowanie strzałki
		$('footer#dol'+k+' img.d0').hide();
		$('footer#dol'+k+' img.d1').show();
		$('footer#dol'+k+' div.nak').addClass('tlo');
		$('footer#dol'+k+' div.nak').removeClass('nak');
	}
	else {
		$('footer#dol'+k+' img.d0').show();
		$('footer#dol'+k+' img.d1').hide();
		$('footer#dol'+k+' div.tlo').addClass('nak');
		$('footer#dol'+k+' div.tlo').removeClass('tlo');
	}
}

function strzalka_g(k, aktywna) {		//narysowanie górnej strzałki do przesuwania listy w kolumnie k
	if(aktywna) {		//aktywowanie strzałki
		$('header#gora'+k+' img.g0').hide();
		$('header#gora'+k+' img.g1').show();
		$('header#gora'+k+' div.nak').addClass('tlo');
		$('header#gora'+k+' div.nak').removeClass('nak');
	}
	else {
		$('header#gora'+k+' img.g0').show();
		$('header#gora'+k+' img.g1').hide();
		$('header#gora'+k+' div.tlo').addClass('nak');
		$('header#gora'+k+' div.tlo').removeClass('tlo');
	}
}

function strzalka_l() {		//narysowanie strzałek do przesuwania paska
	if(MarginesLewy < 0) {
		$('aside#strzalka_l img.l0').hide();
		$('aside#strzalka_l img.l1').show();
		$('aside#strzalka_l div.nak').addClass('tlo');
		$('aside#strzalka_l div.nak').removeClass('nak');
		$('aside#strzalka_l').addClass('aktywny');
	}
	else {
		$('aside#strzalka_l img.l0').show();
		$('aside#strzalka_l img.l1').hide();
		$('aside#strzalka_l div.tlo').addClass('nak');
		$('aside#strzalka_l div.tlo').removeClass('tlo');
		$('aside#strzalka_l').removeClass('aktywny');
	}
}

function strzalka_p() {		//narysowanie strzałek do przesuwania paska
	if(MarginesLewy > -(OSTATNI-PIERWSZY)*200+(SzerAlbumy()-152-190)) {
		$('aside#strzalka_p img.p0').hide();
		$('aside#strzalka_p img.p1').show();
		$('aside#strzalka_p div.nak').addClass('tlo');
		$('aside#strzalka_p div.nak').removeClass('nak');
		$('aside#strzalka_p').addClass('aktywny');
	}
	else {
		$('aside#strzalka_p img.p0').show();
		$('aside#strzalka_p img.p1').hide();
		$('aside#strzalka_p div.tlo').addClass('nak');
		$('aside#strzalka_p div.tlo').removeClass('tlo');
		$('aside#strzalka_p').removeClass('aktywny');
	}
}

function SzerAlbumy() {		//sprawdzenie rozmiarów elementów
	var sz = $("#albumy").css('width');		//pobranie szerokości sekcji z albumami
	sz = parseInt(sz.substr(0, sz.length-2));
    return sz;
}

function WysAlbumy() {		//obliczenie wysokości sekcji z albumami
	var w = $("#albumy").css('height');
	w = parseInt(w.substr(0, w.length-2));
	return w;
}

function zmianaRozmiaruOkna() {		//działania podejmowane gdy użytkownik zmieni rozmiar okna
	var wysListy = WysAlbumy()-153;	// maksymalna wysokość listy w kolumnie z kolekcją
	var top=0, wysokosc=0;

	//dopasowanie strzałek w kolumnach
	for(k=OSTATNI; k>=PIERWSZY; k--) {
		top = $("div.k"+k+" ul").css('top');
		top = parseInt(top.substr(0, top.length-2));
		wysokosc = $("div.k"+k+" ul").css('height');
		wysokosc = parseInt(wysokosc.substr(0, wysokosc.length-2));
		if(top+wysokosc > wysListy) wysokosc=wysListy-top;
		ilosc = $('div.k'+k+' ul li').size();	//pobranie ilości elementów listy w kolekcji
		if(wysokosc+top < wysListy)		wysokosc = wysListy - top;
		if(wysokosc>ilosc*wysPOZYCJI) { wysokosc = ilosc*wysPOZYCJI; top = wysListy-wysokosc; }
		if(ilosc*wysPOZYCJI > wysokosc && wysokosc<wysListy) wysokosc = wysListy;
		if(wysokosc<wysListy) { top = 0; }

		$("div.k"+k+" ul").css('top', top);
		$("div.k"+k+" ul").css('height', wysokosc);
		if(ilosc*wysPOZYCJI > wysokosc+top) strzalka_d(k,1); else strzalka_d(k,0);
		if(top<0) strzalka_g(k,1); else strzalka_g(k,0);
	}
}

function ZmienPolozenieListy(kolumna, przesuniecie) {	//znalezienie i zmiana górnego położenia listy
	var wysListy = WysAlbumy()-153;	// maksymalna wysokość widocznej części listy w kolumnie z kolekcją
	var top = $("div.k"+kolumna+" ul").css('top');
	if(top=='auto') top=0;
	else top = parseInt(top.substr(0, top.length-2));
	var wysokosc = ZmienWysokoscListy(kolumna, 0);
	var maxWysokosc = ($('div.k'+kolumna+' ul li').size())*wysPOZYCJI;	//znalezienie ilości elementów listy
	var maxTop = wysListy - maxWysokosc;		//znalezienie maksymalnej wielkości położenia top listy
	if(wysokosc-przesuniecie < maxWysokosc) strzalka_d(kolumna, 1);
	if(top+przesuniecie < maxTop) {		//sprawdzenie czy nie przekroczono maksymalnego możliwego przesunięcia
		top = maxTop-przesuniecie;
		strzalka_d(kolumna, 0);
	}
	if(top+przesuniecie > 0) {			//sprawdzenie czy nie przekroczono minimalnego możliwego przesunięcia
		top = 0-przesuniecie;
		strzalka_d(kolumna, 1);
	}
	if(maxTop>0) strzalka_d(kolumna, 0);
	if(przesuniecie) {
		$("div.k"+kolumna+" ul").animate({'top': top+przesuniecie}, 500);
		if(top+przesuniecie<0) strzalka_g(kolumna, 1);
		else strzalka_g(kolumna, 0);
	}
	return top;
}

function ZmienPolozenieStopki(kolumna) {	//przesuniecie stopki w kolumnie
	var top = $("footer#dol"+kolumna).css('top');
	top = parseInt(top.substr(0, top.length-2));
	$("footer#dol"+kolumna).animate({'top': top}, 500);
}

function ZmienWysokoscListy(kolumna, zmiana) {	//znalezienie i zmiania wysokości listy w podanej kolumnie o wielkość zmiana
	var wysokosc = $("div.k"+kolumna+" ul").css('height');
	wysokosc = parseInt(wysokosc.substr(0, wysokosc.length-2));
	var maxWysokosc = ($('div.k'+kolumna+' ul li').size())*wysPOZYCJI;	//znalezienie maksymalnej wysokości listy (ilość elementów listy * wysokosc elementu)
	if(wysokosc+zmiana > maxWysokosc) wysokosc = maxWysokosc-zmiana;	//sprawdzenie czy nie przekroczono maksymalnej możliwej wysokości
	if(wysokosc+zmiana < WysAlbumy()-153) wysokosc = WysAlbumy()-153-zmiana;	//sprawdzenie czy nie przekroczono minimalnej możliwej wysokości
	if(zmiana) $("div.k"+kolumna+" ul").animate({'height': wysokosc+zmiana}, 500);	//sprawdzenie czy zażądano zmiany (w celu uniknięcia błędnych przesunięć)
	return wysokosc;
}


///////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
	PIERWSZY = $('p#pierwszy').text();	$('p#pierwszy').remove();
	OSTATNI = $('p#ostatni').text();	$('p#ostatni').remove();

	//dopasowanie strzałek w kolumnach
	var ilosc=0, maxWysokosc=WysAlbumy()-155;
	for(k=OSTATNI; k>=PIERWSZY; k--) {
		$("div.k"+k+" ul").css({height: maxWysokosc});
		ilosc = $('div.k'+k+' ul li').size();	//pobranie ilości elementów listy w kolekcji
		if(ilosc*51 <= maxWysokosc) strzalka_d(k, 0); else strzalka_d(k,1);
	}

	//obsługa lewej strzałki - przesuwanie paska w lewo
	$('#strzalka_l').bind('click',	function() {	klik_lewy();	});
	//obsługa prawej strzałki - przesuwanie paska w prawo
	$('#strzalka_p').bind('click',	function() {	klik_prawy();	});
	//obsługa kliknięcia strzałki w dół
	$('.column footer').bind('click',	function() { var kol=$(this).text();	klik_dol(kol);	});
	//obsługa kliknięcia strzałki w górę
	$('.column header').bind('click',	function() { var kol=$(this).text();	klik_gora(kol);});
	//obsługa zmiany rozmiaru okna
	$(window).resize(zmianaRozmiaruOkna);

	SZEROKOSC = $(".column").css('width');
	SZEROKOSC = parseInt(SZEROKOSC.substr(0, SZEROKOSC.length-2));
	wysPOZYCJI = $(".column li").css('height');
	wysPOZYCJI = parseInt(wysPOZYCJI.substr(0, wysPOZYCJI.length-2));
});