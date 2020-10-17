var brojMjeseca = 10;
let sale = ["1-11","1-15"];
var listaR;
var listaVR;
var mjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];
var ajax = new XMLHttpRequest();

let Kalendar = (function(){
    
    //interne liste
    let redovnaSala;
    let vanrednaSala;
  
    
    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
        let postojiSalaRedovna = 0;
        let postojiSalaVanredna = 0;
        if (kalendarRef != null) {
            document.getElementById('Kalendar').innerHTML = "";
            Kalendar.iscrtajKalendar(kalendarRef, mjesec);
            for (let i = 0; i < redovnaSala.length; i++) {
                if (redovnaSala[i].naziv == sala) {
                    postojiSalaRedovna = 1;
                    break;
                }
            }
            for (let i = 0; i < vanrednaSala.length; i++) {
                if (vanrednaSala[i].naziv == sala) {
                    postojiSalaVanredna = 1;
                    break;
                }
            }
            if (postojiSalaRedovna == 1) {
                for (var i = 0; i < redovnaSala.length; i++) {
                    if (!preklapanjeTermina(redovnaSala[i].pocetak, redovnaSala[i].kraj, pocetak, kraj)) {
                        if (redovnaSala[i].semestar == "zimski") {
                            if (mjesec >= 9 || mjesec == 0) { //validan zimski mjesec
                                if (redovnaSala[i].naziv == sala) {
                                    if (mjesec === 11) { //decembar ima 6 sedmica
                                        for(let j = 3; j <= 8; j++)  { //bojenje
                                            if (kalendarRef.children[0].children[j].children[redovnaSala[i].dan].children[0] != undefined)
                                                kalendarRef.children[0].children[j].children[redovnaSala[i].dan].children[0].style.backgroundColor = "orangered";
                                            else
                                                continue;
                                        }
                                    }
                                    else {
                                        for (let j = 3; j < 8; j++) {
                                            if (kalendarRef.children[0].children[j].children[redovnaSala[i].dan].children[0] != undefined)
                                                kalendarRef.children[0].children[j].children[redovnaSala[i].dan].children[0].className = "zauzeta";
                                            else
                                                continue;
                                        }
                                    }
                                }
                            }
                        }
                        if (redovnaSala[i].semestar == "ljetni") {
                            if (mjesec >= 1 && mjesec <= 5) { //validan ljetni mjesec
                                if (redovnaSala[i].naziv == sala) {
                                    for(let j = 3; j < 8; j++) { //bojenje 
                                        if (kalendarRef.children[0].children[j].children[redovnaSala[i].dan] != undefined)
                                            kalendarRef.children[0].children[j].children[redovnaSala[i].dan].children[0].className = "zauzeta";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (postojiSalaVanredna == 1) {
                for (let i = 0; i < vanrednaSala.length; i++) {
                    if (vanrednaSala[i].naziv == sala) {
                        if (!preklapanjeTermina(vanrednaSala[i].pocetak, vanrednaSala[i].kraj, pocetak, kraj)) {
                            let datumRezervacije = vanrednaSala[i].datum.split('.');
                            if (datumRezervacije[1] - 1 == mjesec) {
                                if (datumRezervacije[1] - 1 == 11 || datumRezervacije[1] - 1 == 8) {
                                    for(let j = 3; j <= 8; j++)  { //bojenje
                                        for (let k = 0; k < 7; k++) {
                                            let danUKalendaru = kalendarRef.children[0].children[j].children[k];
                                            let celijaUKalendaru = kalendarRef.children[0].children[j].children[k];
                                            if (danUKalendaru != undefined) {
                                                if (danUKalendaru.firstChild.data == parseInt(datumRezervacije[0])) {
                                                    celijaUKalendaru.lastChild.className = "zauzeta";
                                                }
                                            } 
                                        }
                                    }
                                }
                                else {
                                    for(let j = 3; j < 8; j++)  { //bojenje
                                        for (let k = 0; k < 7; k++) {
                                            let danUKalendaru = kalendarRef.children[0].children[j].children[k];
                                            let celijaUKalendaru = kalendarRef.children[0].children[j].children[k];
                                            if (danUKalendaru != undefined) {
                                                if (danUKalendaru.firstChild.data == parseInt(datumRezervacije[0])) {
                                                    celijaUKalendaru.lastChild.className = "zauzeta";
                                                }
                                            } 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            kalendarRef.innerHTML = "";
            Kalendar.iscrtajKalendar(kalendarRef,mjesec);
        }
    };

    function ucitajPodatkeImpl(periodicna, vanredna){
        redovnaSala = periodicna;
        listaR = redovnaSala;
        vanrednaSala = vanredna;
        listaVR = vanrednaSala;
        let sala = document.getElementById('listaSala').value - 1;
        Kalendar.obojiZauzeca(document.getElementById('Kalendar'),brojMjeseca,sale[sala],document.getElementById('pocetak').value,document.getElementById('kraj').value);
    };

    function iscrtajKalendarImpl(kalendarRef, mjesec){
        if (mjesec < 0 || mjesec > 11) {
        }
        let tbl = document.createElement("table");
        tbl.style.backgroundColor = "rgb(228,228,228)";
        tbl.style.border = "3 px solid grey";
        let danas = new Date();
        let prviDan = (new Date(2019, mjesec)).getDay();
        let brojDanauMjesecu = 32 - new Date(2019, mjesec,32).getDate();
        mjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];
        let dani = ["PON", "UTO", "SRI", "ČET", "PET", "SUB", "NED"];
        let datum = 1;
        for (let i = 0; i < 9; i++) {
            let red = document.createElement("tr");
            if (i == 0) {
                //naziv mjeseca, prvi red
                let celija = document.createElement("td");
                let tekst = document.createTextNode(mjeseci[mjesec]);
                let bold = document.createElement('strong');
                bold.appendChild(tekst);
                celija.appendChild(bold);
                celija.colSpan = "7";
                red.appendChild(celija);
            } //drugi red
            else if (i == 1) {
                for (let k = 0; k < 7; k++) {
                    if (k == 0) {     
                        let celija = document.createElement("td");
                        let tekst = document.createTextNode("\u00A0");
                        celija.appendChild(tekst);
                        red.appendChild(celija);
                    }
                }
            }
            //naziv dana u mjesecu, treći red
            else if (i == 2) {
                for (let k = 0; k < 7; k++) {
                    let celija = document.createElement("td");
                    let tekst = document.createTextNode(dani[k]);
                    celija.appendChild(tekst);
                    celija.style.border = "3px solid steelblue";
                    celija.style.textAlign = "center";
                    red.appendChild(celija);
                }
            }
            //dani u mjesecu, četvrti do devetog reda
            else {
                for (let j = 0; j < 7; j++) {
                    if (prviDan - 1 < 0)
                        prviDan += 7;
                    //za prazne ćelije
                    if (i == 3 && j < prviDan-1) { // ne radi za decembar i septembar
                        let celija = document.createElement("td");
                        let tekst = document.createTextNode("");
                        celija.appendChild(tekst);
                        red.appendChild(celija);
                    }
                    else if (datum > brojDanauMjesecu) {
                        break;
                    }
                    else {
                        let celija = document.createElement("td");
                        let tekst = document.createTextNode(datum);
                        celija.appendChild(tekst);
                        celija.style.textAlign = "center";
                        celija.style.border = "3px solid steelblue";
                        celija.style.backgroundColor = "white";
                        for (let k = 0; k < 1; k++) {
                            let celija2 = document.createElement("td");
                            let tekst2 = document.createTextNode("");
                            celija2.appendChild(tekst2);
                            celija2.style.padding = "13px";
                            celija2.style.alignSelf = "center";
                            celija2.style.border = "4px solid steelblue";
                            celija2.className = "slobodna";
                            celija.appendChild(celija2);
                        }
                        red.appendChild(celija);
                        datum++;
                    }    
                }
            }
            tbl.appendChild(red); // appending each row into calendar body.
            kalendarRef.appendChild(tbl);
        }
    };

    return {
    obojiZauzeca: obojiZauzecaImpl,
    ucitajPodatke: ucitajPodatkeImpl,
    iscrtajKalendar: iscrtajKalendarImpl
    }
    }());
    

function prethodni() {
    document.getElementById('Kalendar').innerHTML = "";
    if (brojMjeseca - 1 < 0) {
        Kalendar.iscrtajKalendar(document.getElementById('Kalendar'), 0);
    }
    else {
        brojMjeseca -= 1;
        Kalendar.iscrtajKalendar(document.getElementById('Kalendar'), brojMjeseca);
    }
    popuniRezervacije();
};

function sljedeci() {
    document.getElementById('Kalendar').innerHTML = "";
    if (brojMjeseca + 1 > 11) {
        Kalendar.iscrtajKalendar(document.getElementById('Kalendar'), 11);
        popuniRezervacije();
    }
    else  {
        brojMjeseca++;
        Kalendar.iscrtajKalendar(document.getElementById('Kalendar'), brojMjeseca);
        popuniRezervacije();

    }
    popuniRezervacije();
};

function preklapanjeTermina(sala_satnicaP, sala_satnicaK, termin_pocetak, termin_kraj){
    var satnicaP = sala_satnicaP.split(':');
    satnicaP[0] = parseInt(satnicaP[0]);
    satnicaP[1] = parseInt(satnicaP[1]);
    var satnicaK = sala_satnicaK.split(':');
    satnicaK[0] = parseInt(satnicaK[0]);
    satnicaK[1] = parseInt(satnicaK[1]);
// termin koji želimo da rezervišemo
    var terminP = termin_pocetak.split(':');
    terminP[0] = parseInt(terminP[0]);
    terminP[1] = parseInt(terminP[1]);
    var terminK = termin_kraj.split(':');
    terminK[0] = parseInt(terminK[0]);
    terminK[1] = parseInt(terminK[1]);
    
    if (terminP[0] == terminK[0] && terminP[1] >= terminK[1]) {
       return false;
    }

    if (terminP[0] > terminK[0]) {
        return false;
    }
    if (satnicaP[0] == terminP[0] && satnicaK[0] == terminK[0]) {
       return false;
    }
    if(satnicaP[0] == terminP[0] && satnicaK[0] <= terminK[0]) {
        return false;
    }
    if(satnicaP[0] == terminP[0] && satnicaP[1] < terminP[1]) {
        return true;
    }
    if(satnicaP[0] <= terminK[0] && satnicaK[0] > terminK[0]) {
        return false;
    }
    if(satnicaP[0] < terminP[0]) {
        if(terminP[0] < satnicaK[0]) {
            return false;
        }
        if(terminP[0] > satnicaK[0]) {
            return true;
        }
        if(terminP[0] == satnicaK[0]) {
            if(satnicaK[0] <= terminK[0]) {
                return true;
            }
            else {
               return false;
            }
        }
    }
    else if (satnicaP[0] > terminP[0]) {
        if(satnicaP[1] < terminP[1]) {
            return true;
        }
        if(satnicaP[0] <= terminK[0]) {
            return false;
        }
        if(satnicaP[0] == terminP[1]){
            if(terminK[1] <= satnicaP[1]) {
                return true;
            }
            else 
                return false;
        }
    }
    return true;
};

function popuniRezervacije() {
    Kalendar.ucitajPodatke(listaR,listaVR);
    document.querySelectorAll('.kalendar td').forEach(d => d.addEventListener("click", function(){
        if (d.className.includes("slobodna")) {
            
            //slobodan termin 
            var klik = confirm("Da li želite rezervisati ovaj termin?");
            if (klik == true) {
                //hoćemo rezervisat
                let periodicnost = document.getElementById("periodicna").checked;
                let nazivSale = sale[document.getElementById("listaSala").value-1];
                let pocetakTermina = document.getElementById("pocetak").value;
                let krajTermina = document.getElementById("kraj").value;
                let dan = d.parentElement.innerText;
                let nazivMjeseca = d.parentElement.parentElement.parentElement.children[0].innerText;
                let mjesec = parseInt(mjeseci.indexOf(nazivMjeseca)+1,10)
                let datum = dan+"."+mjesec+"."+2019;
                let predavac = document.getElementById("listaOsoblje").options[document.getElementById("listaOsoblje").selectedIndex].text;
                let semestar = "";
                if (periodicnost == true) {
                    if (mjesec > 9 || mjesec == 1) {
                            //zimski semestar
                            semestar = "zimski";
                    }
                    else if (mjesec > 1 && mjesec <= 6) {
                        //ljetni semestar
                        semestar = "ljetni";
                    }
                }
                if (periodicnost == true) {
                    //periodična rezervacija
                    console.log("periodična rezervacija za: " + datum); 
                    ajax = new XMLHttpRequest();
                    ajax.onreadystatechange = function() {
                        if (ajax.readyState == 4 && ajax.status == 404) {
                            let x = alert("Nije moguće rezervisati salu " + nazivSale + " za datum: " + datum + ", termin: " + pocetakTermina + " - " + krajTermina);
                        }
                        else if (ajax.readyState == 4 && ajax.status == 200) {
                            let noviPodaci = JSON.parse(ajax.responseText);
                            let a=noviPodaci.periodicna;
                            Kalendar.ucitajPodatke(a, listaVR); 
                        }
                    }
                    let item = {
                        datum,
                        semestar,
                        pocetakTermina,
                        krajTermina,
                        nazivSale,
                        predavac,
                        periodicnost
                    };
                    ajax.open("POST", "http://localhost:8080/public/zauzeca.json", true);
                    ajax.setRequestHeader("Content-Type", "application/json");
                    ajax.send(JSON.stringify(item));
                }
                else {
                    //vanredna rezervacija
                    periodicnost = false;
                    let item = {
                        datum,
                        semestar,
                        pocetakTermina,
                        krajTermina,
                        nazivSale,
                        predavac,
                        periodicnost
                    };
                    console.log("vanredna rezervacija za: " + datum); 
                    ajax = new XMLHttpRequest();
                    ajax.onreadystatechange = function() {
                        if (ajax.readyState == 4 && ajax.status == 404) {
                            console.log(ajax.statusText);
                            let x = alert("Nije moguće rezervisati salu " + nazivSale + " za datum: " + datum + ", termin: " + pocetakTermina + " - " + krajTermina);
                        }
                        else if (ajax.readyState == 4 && ajax.status == 200) {
                            let noviPodaci = JSON.parse(ajax.responseText);
                            let a=noviPodaci.periodicna;
                            let b=noviPodaci.vanredna;
                            Kalendar.ucitajPodatke(listaR, b); 
                        }
                    }
                    ajax.open("POST", "http://localhost:8080/public/zauzeca.json", true);
                    ajax.setRequestHeader("Content-Type", "application/json");
                    ajax.send(JSON.stringify(item));
                }
            }
            else {
                //cancel rezervacije
            }
        }
        else {
            //zauzet termin
        }
        Kalendar.ucitajPodatke(listaR,listaVR);

    }));

};

function provjeraDatuma() {
    for (let i = 0; i < listaVR.length; i++) {
        if (listaVR[i].datum.match("^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$"))
            return false;
    }
    return true;
};

popuniRezervacije();
