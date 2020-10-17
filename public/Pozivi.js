var dobavljeneSlike = [];
var brojLoadanihSlika =  0;
var preostaleSlike = 0;
var naziviSlika = [];
var naziviOsoba = [];
let Pozivi = (function() {

    function ucitajOsoblje() {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.response);
                let selekt = document.getElementById("listaOsoblje");
                for (let i = 0; i < jsonRez.length; i++) {
                    let option  = document.createElement("option");
                    option.text = jsonRez[i]['ime']+ " " + jsonRez[i]['prezime'];
                    naziviOsoba.push(jsonRez[i]['ime']+ " " + jsonRez[i]['prezime']);
                    selekt.add(option);
                }
            }
        }
        ajax.open("GET","http://localhost:8080/osoblje",true);
        ajax.send();
    };

    function ucitajRezervacije() {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.response);
                console.log(jsonRez.periodicna,jsonRez.vanredna);
                Kalendar.ucitajPodatke(jsonRez.periodicna,jsonRez.vanredna);
            }
        }
        ajax.open("GET","http://localhost:8080/rezervacija",true);
        ajax.send();
    }

    function ucitajSlike(){
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && ajax.status == 200){
                dobavljeneSlike = ajax.response; 
                let x = dobavljeneSlike.toString();
                naziviSlika = x.split(".png");
                naziviSlika.length--;
                if (naziviSlika.length > 0) {
                    for(let i = 1; i < 4; i++) {
                        if (naziviSlika[i-1].includes(i)) {
                            if (i % 3 == 1) {
                                document.getElementById('grid-item1').innerHTML = "";
                                document.getElementById('grid-item1').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i-1] + '.png' + '">';
                                brojLoadanihSlika++;
                                preostaleSlike++;
                            }
                            else if (i % 3 == 2) {
                                document.getElementById('grid-item2').innerHTML = "";
                                document.getElementById('grid-item2').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i-1] + '.png'  + '">';
                                brojLoadanihSlika++;
                                preostaleSlike++;
                            }
                            else if (i % 3 == 0) {
                                document.getElementById('grid-item3').innerHTML = "";
                                document.getElementById('grid-item3').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i-1] + '.png'  + '">';
                                brojLoadanihSlika++;
                                preostaleSlike++;
                            }
                        }
                    }
                }            
            }
        }
        ajax.open("GET","http://localhost:8080/pocetna",true);
        ajax.send();
    };

    return {
        ucitajOsoblje: ucitajOsoblje,
        ucitajRezervacije: ucitajRezervacije,
        ucitajSlike: ucitajSlike
    }}());


    function sljedecaSlika(){
        if(brojLoadanihSlika == naziviSlika.length-1) {
            if (brojLoadanihSlika % 3 == 1) {
                document.getElementById('grid-item1').innerHTML = "";
                document.getElementById('grid-item3').innerHTML = ""; 
                document.getElementById('grid-item2').innerHTML = '<img width="250" height="250" src="' + naziviSlika[brojLoadanihSlika] + '.png' + '">';
            }
            else if (brojLoadanihSlika % 3 == 2) {
                document.getElementById('grid-item2').innerHTML = "";
                document.getElementById('grid-item1').innerHTML = ""; 
                document.getElementById('grid-item3').innerHTML = '<img width="250" height="250" src="' + naziviSlika[brojLoadanihSlika] + '.png' + '">';
            }
            else if (brojLoadanihSlika % 3 == 0) {
                document.getElementById('grid-item2').innerHTML = "";
                document.getElementById('grid-item3').innerHTML = "";
                document.getElementById('grid-item1').innerHTML = '<img width="250" height="250" src="' + naziviSlika[brojLoadanihSlika] + '.png' + '">';
            }
        }
        else {
            let temp = brojLoadanihSlika;
            for(let i = brojLoadanihSlika; i < temp+3; i++) {
                if (naziviSlika[brojLoadanihSlika].includes(i+1)) {
                    if (i % 3 == 1) {
                        document.getElementById('grid-item2').innerHTML = "";
                        document.getElementById('grid-item2').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i] + '.png' + '">';
                        preostaleSlike++;
                        brojLoadanihSlika++;
                    }
                    else if (i % 3 == 2) {
                        document.getElementById('grid-item3').innerHTML = "";
                        document.getElementById('grid-item3').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i] + '.png'  + '">';
                        preostaleSlike++;
                        brojLoadanihSlika++;
                    }
                    else if (i % 3 == 0) {
                        document.getElementById('grid-item1').innerHTML = "";
                        document.getElementById('grid-item1').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i] + '.png'  + '">';
                        preostaleSlike++;
                        brojLoadanihSlika++;
                    }
                }
            }
        }
    };

    function prethodnaSlika(){
        if (preostaleSlike < 2) {
            //ako su učitane <= 3 slike, zabrani prethodni jer smo popunili grid-iteme
        }
        else {
            let x = preostaleSlike;
            let y = brojLoadanihSlika;
            console.log(" bLS " + y);
            console.log(" pS " + x);
            if (y == naziviSlika.length-2) {
                for(let i = brojLoadanihSlika-3; i < naziviSlika.length-1; i++) {
                    if (naziviSlika[i].includes(i+1)) {
                        if (i % 3 == 0) {
                            brojLoadanihSlika--;
                            preostaleSlike--;
                            document.getElementById('grid-item1').innerHTML = '<img width="250" height="250" src="' + naziviSlika[naziviSlika.length-5] + '.png'  + '">';
                        }
                        else if (i % 3 == 1) {
                            brojLoadanihSlika--;
                            preostaleSlike--;
                            document.getElementById('grid-item2').innerHTML = '<img width="250" height="250" src="' + naziviSlika[naziviSlika.length-4] + '.png' + '">';
                        }
                        else if (i % 3 == 2) {
                            brojLoadanihSlika--;
                            preostaleSlike--;
                            document.getElementById('grid-item3').innerHTML = '<img width="250" height="250" src="' + naziviSlika[naziviSlika.length-3] + '.png'  + '">';
                        }
                    }
                }
            }
            else if (preostaleSlike >= 3){
                for(let i = x-3; i < x; i++) {
                    if (naziviSlika[i].includes(i+1)) {
                        if (i % 3 == 0) {
                            document.getElementById('grid-item1').innerHTML = " ";
                            document.getElementById('grid-item1').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i] + '.png'  + '">';
                            preostaleSlike--;
                            brojLoadanihSlika--;
                        }
                        else if (i % 3 == 1) {
                            document.getElementById('grid-item2').innerHTML = " ";
                            document.getElementById('grid-item2').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i] + '.png' + '">';
                            preostaleSlike--;
                            brojLoadanihSlika--;

                        }
                        else if (i % 3 == 2) {
                            document.getElementById('grid-item3').innerHTML = " ";
                            document.getElementById('grid-item3').innerHTML = '<img width="250" height="250" src="' + naziviSlika[i] + '.png'  + '">';
                            preostaleSlike--;
                            brojLoadanihSlika--;
                        }
                    }
                }
            }
        }
    };

    function ucitaj_Slike() {
        Pozivi.ucitajSlike();
    };

    ucitaj_Slike();

