/* obsługa pokazu dla średnich zdjeć w albumie */
/* (C) mgr inż. Bartłomiej Trojnar; (III) lipiec 2015 */
var liczbaZdjec = 0, ladujMale = [], ladujDuze = []; //informacja czy zostały załadowane zdjęcia
var zaladowane = 0;				//numer wyświetlanego zdjęcia
var active = 1;					//numer wyświetlanego zdjęcia
var miniSzerokosc = 0;			//szerokość wszystkich zdjęć w pasku miniatur
var mleft = [];					//szerokości miniaturek zdjęć oraz margines z lewej strony
var maxiSze = [], maxiWys = [];	//szerokości i wysokości dużych zdjęć


function aktywuj_miniaturke() {		//aktywowanie zdjęcia
	if(active>liczbaZdjec)	active=1;
	if(active<=0)			active=liczbaZdjec;
	$('header nav a').removeClass('aktywny');	//usunięcie klasy aktywny - deaktywacja miniaturki
	$('header nav a[rel='+active+']').addClass('aktywny');
}

function klik_dol() {				//obsługa zdarzenia kliknięcia w strzałkę w dół
	var przesuniecie = ObliczPrzesuniecie();	//obliczenie przesuniecia elementów
	var t = ZmienPolozenieListy(-przesuniecie);	//znalezienie i zmiana górnego położenia listy
	ZmienWysokoscListy(przesuniecie, t);		//znalezienie i zmiania wysokości listy
}

function klik_gora() {				//obsługa zdarzenia kliknięcia w strzałkę w górę
	var przesuniecie = ObliczPrzesuniecie();	//obliczenie przesuniecia elementów
	var t = ZmienWysokoscListy(-przesuniecie);	//znalezienie i zmiania wysokości listy
	ZmienPolozenieListy(przesuniecie, t);		//znalezienie i zmiana górnego położenia listy
}

function klik_lewy() {				//obsługa zdarzenia kliknięcia w strzałkę w lewo
	aktywuj_miniaturke(--active);
	pokaz_animuj(active);
	przesun_pasek();
}

function klik_prawy() {				//obsługa zdarzenia kliknięcia w strzałkę w prawo
	aktywuj_miniaturke(++active);
	pokaz_animuj(active);
	przesun_pasek();
}

function klik_mini(ktore) {			//obsługa zdarzenia kliknięcia w miniaturkę zdjęcia
	active = ktore;
	aktywuj_miniaturke();
	pokaz_animuj(active);
	przesun_pasek();
}

function klik_przod() {				//przesunięcie paska miniaturek w prawo
	var nw = parseInt($('header').css('width'))-150;
	przesun_pasek(-nw);
}

function klik_tyl() {				//przesunięcie paska miniaturek w lewo
	var nw = parseInt($('header').css('width'))-150;
	przesun_pasek(nw);
}

function ladujZdjecia() {		//ładowanie zdjęć w pokazie
	for(k=1; k<=liczbaZdjec; k++) if(!ladujMale[k]) break;
	ladujZdjecieMale(k);
}
/*
function ladujZdjecieDuze(i, koniec) {		//ładowanie zdjęć dużych
	if(i>koniec || i>liczbaZdjec) return i;
	if(ladujDuze[i]) return i;
	var src2 = $('div#zdj'+i+' p.sciezka').text();
	$('div#zdj'+i+' img').attr('src', src2).load(function() {
		$('div#zdj'+i+' p.sciezka').remove();
		ladujDuze[i]=1;
		zaladowane++;
		ladujZdjecieDuze(parseInt(i)+1, koniec);
	});
    $("#liczduze").attr("value", 100*zaladowane/liczbaZdjec);
	if(zaladowane>=liczbaZdjec-1) $('#liczduze').remove();
}
*/
function ladujZdjecieMale(i) {		//ładowanie zdjęć małych
	if(ladujMale[i]) return i;
	if(i>liczbaZdjec) return i;
	var src = $('a[rel='+i+']').text();
	$('<img />').attr('src', src).load(function() {
		$('a[rel='+i+']').text('');
		$('a[rel='+i+']').append($(this));
		$('a[rel='+i+']').removeClass('ukryj');
		mleft[i] = licz_margines(i);
		ladujMale[i]=1;
		//obliczenie bieżącego marginesu w pasku zdjęć
		var margines = parseInt($('header nav div:first-child').css('margin-left'));
		var nw = parseInt($('header').css('width'))-54;
		ladujZdjecieMale(i+1);
	});
    $("#liczmale").attr("value", 100*i/liczbaZdjec);
	if(i>=liczbaZdjec) $('#liczmale').remove();
}
/*
function licz_margines(i) {			//obliczenie marginesu dla paska
	if(i<=1) return 0;
	if(mleft[i-1]) return mleft[i-1] + parseInt($('nav a[rel='+i+'] img').css('width'))+19;
	return licz_margines(i-1) + parseInt($('nav a[rel='+i+'] img').css('width'))+19;
}
*/
function ObliczPrzesuniecie(k) {	//znalezienie wysokości widocznej części listy - wartości o którą należy ją przesunąć
	var przesuniecie = $("body > nav").css('height');
	przesuniecie = parseInt(przesuniecie.substr(0, przesuniecie.length-2))-250;
	przesuniecie = przesuniecie - (przesuniecie % wysPOZYCJI);
	if(przesuniecie<wysPOZYCJI) przesuniecie = wysPOZYCJI;
	return przesuniecie;
}

function pokaz_animuj(ktore) {		//wyśwwietlenie wskazanego zdjęcia
	//ustawienie głownych strzałek lewo - prawo
	if(active>1) strzalka_l2(1);			else strzalka_l2(0);
	if(active<liczbaZdjec) strzalka_p2(1);	else strzalka_p2(0);

	//zmiana wymiarów pokazu
	$("a.active").removeClass('active');
	$('div#zdj'+ktore+' a').addClass('active');
	wymiary_zdjecia(ktore);

	//podpis zdjęcia
	var pod = $('div#zdj'+active+' h2').text();
	var aut = $('div#zdj'+active+' p.autor').text();
	var napis = '<b>zdjęcie: '+active+" z "+liczbaZdjec+"</b>";
	$('#podpis').html('<h2>'+pod+'</h2><p>'+aut+'</p><div id="licznik">'+napis+'</div>');
}

function przesun_pasek(ile) {		//przesunięcie paska z miniaturkami o określoną wielkość
	var nowy = parseInt($('header nav div:first-child').css('margin-left'));
	if(ile) nowy += ile;
	else {
		nowy = 0;
		for(i=1; i<active; i++) {
			if(maxiWys[i] > 105)	wsp = maxiWys[i] / 105;
			if(maxiSze[i]/wsp > 155)	szer_zdjecia = 155;
			else szer_zdjecia = maxiSze[i]/wsp;
			szer_zdjecia = parseInt(szer_zdjecia);
			nowy -= (szer_zdjecia+19);
		}
		nowy += parseInt($('header').css('width'))/2;		//połowa szerokości paska z miniaturkami
	}

	//sprawdzenie czy margines mieści się we właściwych granicach i ustawienie strzałek
	//margines i strzałka z lewej
	if(nowy>=65) { nowy=65;	strzalka_l(0); } else strzalka_l(1);
	//margines i strzałka z prawej
	var nw = parseInt($('header').css('width'))-54;
	if(nowy<-miniSzerokosc+nw) {
		nowy=-miniSzerokosc+nw;
		strzalka_p(0);
	}
	else strzalka_p(1);
	//przypisanie obliczonego marginesu do pierwszego elementu paska nawigacji
	var marg='3px 3px 3px '+nowy+'px';
	$('header nav div:first-child').animate({'margin': marg }, 500);
	ladujZdjecia();
}

function strzalka_d(aktywna) {	//ustawienie właściwej dolnej strzałki do przesuwania listy nawigacyjnej
	if(aktywna) {		//aktywowanie strzałki
		$("body > nav footer img.d0").hide();
		$("body > nav footer img.d1").show();
		$("body > nav footer div.nak").addClass('tlo');
		$("body > nav footer div.nak").removeClass('nak');
	}
	else {
		$("body > nav footer img.d0").show();
		$("body > nav footer img.d1").hide();
		$("body > nav footer div.tlo").addClass('nak');
		$("body > nav footer div.tlo").removeClass('tlo');
	}
}

function strzalka_g(aktywna) {	//ustawienie właściwej górnej strzałki do przesuwania listy nawigacyjnej
	if(aktywna) {		//aktywowanie strzałki
		$("body > nav header img.g0").hide();
		$("body > nav header img.g1").show();
		$("body > nav header div.nak").addClass('tlo');
		$("body > nav header div.nak").removeClass('nak');
	}
	else {
		$("body > nav header img.g0").show();
		$("body > nav header img.g1").hide();
		$("body > nav header div.tlo").addClass('nak');
		$("body > nav header div.tlo").removeClass('tlo');
	}
}

function strzalka_l(aktywna) {		//ustawienie właściwej lewej strzałki w pasku miniaturek
	if(aktywna) {
		$("aside#strzalka_l img").attr('src', "css/strzalka_l1.png");
		$("#strzalka_l div.nak").addClass('tlo');
		$("#strzalka_l div.nak").removeClass('nak');
	}
	else {
		$("aside#strzalka_l img").attr('src', "css/strzalka_l0.png");
		$("#strzalka_l div.tlo").addClass('nak');
		$("#strzalka_l div.tlo").removeClass('tlo');
	}
}

function strzalka_p(aktywna) {		//ustawienie właściwej prawej strzałki w pasku miniaturek
	if(aktywna) {
		$("#strzalka_p img").attr('src', "css/strzalka_p1.png");
		$("#strzalka_p div.nak").addClass('tlo');
		$("#strzalka_p div.nak").removeClass('nak');
	}
	else {
		$("#strzalka_p img").attr('src', "css/strzalka_p0.png");
		$("#strzalka_p div.tlo").addClass('nak');
		$("#strzalka_p div.tlo").removeClass('tlo');
	}
}

function strzalka_l2(aktywna) {		//ustawienie właściwej lewej strzałki do zmiany obrazu
	if(aktywna) {
		$("#strzalka_l2 img").attr('src', "css/strzalka_l1.png");
		$("#strzalka_l2 div.nak").addClass('tlo');
		$("#strzalka_l2 div.nak").removeClass('nak');
	}
	else {
		$("#strzalka_l2 img").attr('src', "css/strzalka_l0.png");
		$("#strzalka_l2 div.tlo").addClass('nak');
		$("#strzalka_l2 div.tlo").removeClass('tlo');
	}
}

function strzalka_p2(aktywna) {		//ustawienie właściwej prawej strzałki do zmiany obrazu
	if(aktywna) {
		$("#strzalka_p2 img").attr('src', "css/strzalka_p1.png");
		$("#strzalka_p2 div.nak").addClass('tlo');
		$("#strzalka_p2 div.nak").removeClass('nak');
	}
	else {
		$("#strzalka_p2 img").attr('src', "css/strzalka_p0.png");
		$("#strzalka_p2 div.tlo").addClass('nak');
		$("#strzalka_p2 div.tlo").removeClass('tlo');
	}
}

function ustaw_strzalki() {			//dopasowanie położenia strzałek lewo-prawo przy wyświetlanym zdjęciu
	var wysokosc = parseInt($('#pokaz').css('height'));	//wysokość sekcji z pokazem zdjęć
	wysokosc = (wysokosc - 60)/2-60;		//połowa wysokości zmniejszona o wysokość podpisu i połowę wysokości strzałki
	$('#strzalka_l2').css('padding-top', wysokosc);
	$('#strzalka_p2').css('padding-top', wysokosc);
}

function wymiary_zdjecia(ktore) {	//dopasowanie wymiarów wyświetlanego zdjęcia
	var wysObszaru = parseInt($('#zdjecia').css('height'));		//wysokość obszaru w którym pokazywane jest zdjęcie
	var szerObszaru = parseInt($('#pokaz').css('width'))-160;	//szerokość obszaru w którym pokazywane jest zdjęcie (bez strzałek)
	//wysokość dużego zdjęcia
	var wysokosc = maxiWys[ktore];
	//jeżeli nie załadowano dużego zdjęcia
	if(!ladujMale[ktore]) ladujZdjecia();
	else if(!ladujDuze[ktore]) ladujZdjecieDuze(ktore, liczbaZdjec);
	if(wysokosc>wysObszaru) wysokosc = wysObszaru;
	//ustawienie rozmiarów
	$('div#zdj'+ktore+' img').css({'max-height': wysokosc});
	$('div#zdj'+ktore+' img').css({'max-width': szerObszaru});
}

function WysNawigacji() {			//obliczenie wysokości sekcji nawigacyjnej
	var w = $("body > nav").css('height');
	w = parseInt(w.substr(0, w.length-2));
	return w;
}

function zapisz_wymiary() {			//sprawdzenie i zapisanie wymiarów zdjęć
	for(i=1; i<=liczbaZdjec; i++) {
		maxiSze[i] = parseInt($('div#zdj'+i+' p.szerokosc').text());
		maxiWys[i] = parseInt($('div#zdj'+i+' p.wysokosc').text());
		$('div#zdj'+i+' p.szerokosc').remove();
		$('div#zdj'+i+' p.wysokosc').remove();
		if(maxiWys[i] > 105)	wsp = maxiWys[i] / 105;
		if(maxiSze[i]/wsp > 155)	szer_zdjecia = 155;
		else szer_zdjecia = maxiSze[i]/wsp;
		szer_zdjecia = parseInt(szer_zdjecia);
		miniSzerokosc += szer_zdjecia+19;
	}
	miniSzerokosc += 65;
}

function zmianaRozmiaruOkna() {		//działania podejmowane gdy użytkownik zmieni rozmiar okna
	ustaw_strzalki();
	pokaz_animuj(active);
	var t = ZmienPolozenieListy(0);		//znalezienie i zmiana górnego położenia listy
	ZmienWysokoscListy(800, t);			//znalezienie i zmiania wysokości listy
	t = $("body > header").css('width');
	t = parseInt(t.substr(0, t.length-2))-120;
	$("progress").css('width', t);
}

function ZmienPolozenieListy(przesuniecie) {	//znalezienie i zmiana górnego położenia listy
	//obliczenie aktualnego położenia listy
	var top = $("#ig").css('top');
	top = parseInt(top.substr(0, top.length-2));
	//obliczenie nowego położenia listy
	top += przesuniecie;
	//sprawdzenie czy nowe położenie mieści się w dopuszczalnych granicach
	var ilosc = $("#ig li").size();							//pobranie ilości elementów listy nawigacyjnej
	var minTop = WysNawigacji() - 50 - ilosc*wysPOZYCJI;	//znalezienie minimalnego położenia top listy
	if(top <= minTop) {		//sprawdzenie czy nie przekroczono minimalnego możliwego przesunięcia
		top = minTop;
		strzalka_d(0);
	}
	else strzalka_d(1);
	if(ilosc*wysPOZYCJI<=WysNawigacji()-250) strzalka_d(0);
	if(top >= 200) {		//sprawdzenie czy nie przekroczono minimalnego możliwego przesunięcia
		top = 200;
		strzalka_g(0);
	}
	else strzalka_g(1);
	$("#ig").animate({'top': top}, 500);
	return top;
}

function ZmienWysokoscListy(zmiana, top) {	//znalezienie i zmiania wysokości listy nawigacyjnej o wielkość zmiana
	//obliczenie aktualnej wysokości listy
	var wysokosc = $("#ig").css('height');
	wysokosc = parseInt(wysokosc.substr(0, wysokosc.length-2));
	var h=wysokosc;
	//obliczenie nowego położenia listy
	wysokosc += zmiana;
	//obliczenie minimalnej dopuszczalnej wysokości listy
	var minWysokosc = WysNawigacji() - 250;					//wysokość pola przeznaczonego na listę
	var ilosc = $("#ig li").size();							//pobranie ilości elementów listy nawigacyjnej
	if(minWysokosc > ilosc*wysPOZYCJI) minWysokosc = ilosc*wysPOZYCJI;	//znalezienie minimalnego położenia top listy
	//obliczenie maksymalnej dopuszczalnej wysokości listy
	var maxWysokosc = WysNawigacji() - 50 - top;
	if(wysokosc < minWysokosc) wysokosc = minWysokosc;
	if(wysokosc > maxWysokosc) wysokosc = maxWysokosc;
	//zmiana wysokosci
	$("#ig").animate({'height': wysokosc}, 500);
	return wysokosc;
}


///////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
	// obsługa zdarzenia kliknięcia w strzałkę w lewo
	$('#strzalka_l2').bind('click', function(){	klik_lewy();	});
	// obsługa zdarzenia kliknięcia w strzałkę w prawo
	$('#strzalka_p2').bind('click', function(){	klik_prawy();	});
	// obsługa zdarzenia kliknięcia w miniaturkę zdjęcia
	$('header nav a').bind('click', function(){ klik_mini($(this).attr('rel')); });
	//obsługa lewej strzałki - przesuwanie paska w lewo
	$('#strzalka_l').bind('click',	function() {	klik_tyl();	});
	//obsługa prawej strzałki - przesuwanie paska w prawo
	$('#strzalka_p').bind('click',	function() {	klik_przod();});
	//obsługa kliknięcia strzałki w dół
	$('body > nav footer').bind('click',	function() { klik_dol();	});
	//obsługa kliknięcia strzałki w górę
	$('body > nav header').bind('click',	function() { klik_gora();	});
	//obsługa naciskania klawiszy
	$(window).bind("keydown", function(oEvent){
		if(oEvent.keyCode == 37)	klik_lewy();
		if(oEvent.keyCode == 39)	klik_prawy();
		if(oEvent.keyCode == 38)	klik_przod();
		if(oEvent.keyCode == 40)	klik_tyl();
	});

	//obsługa zmiany rozmiaru okna
	$(window).resize(zmianaRozmiaruOkna);
	//pobranie i usunięcie informacji o ilości zdjęć
	liczbaZdjec = parseInt($('p#dlugosc').text());		//liczba zdjęć w albumie
	$('p#dlugosc').remove();							//usunięcie powyższej informacji ze strony
	wysPOZYCJI = $("#ig li").css('height');
	wysPOZYCJI = parseInt(wysPOZYCJI.substr(0, wysPOZYCJI.length-2));		//wysokość elementu na liście albumów

	//ustawienie strzałek w środku
	ZmienPolozenieListy(0);
	ustaw_strzalki();

	zapisz_wymiary();
//	for(i=1; i<=liczbaZdjec; i++) { ladujMale[i] = 0; ladujDuze[i] = 0; }
	ladujZdjecia();
//	ladujZdjecieDuze(1,2);

	aktywuj_miniaturke();
	//zmiana wymiarów pokazu
	$('div#zdj1 a').addClass('active');
	var wysObszaru = parseInt($('#zdjecia').css('height'));		//wysokość obszaru w którym pokazywane jest zdjęcie
	$('div#zdj1 img').css({'max-height': wysObszaru});
	//podpis zdjęcia
	var pod = $('div#zdj1 h2').text();
	var aut = $('div#zdj1 p.autor').text();
	var napis = "<b>zdjęcie: 1 z "+liczbaZdjec+"</b>";
	$('#podpis').html('<h2>'+pod+'</h2><p>'+aut+'</p><div id="licznik">'+napis+'</div>');
	pod = $("body > header").css('width');
	pod = parseInt(pod.substr(0, pod.length-2))-120;
	$("progress").css('width', pod);
});