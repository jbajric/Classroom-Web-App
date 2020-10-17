
var sveRezervacije = [];
var sviTermini = [];
var SALE = ["1-11","1-15"];
const db = require('../db');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');

function upisiOsobeuTabelu(){
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && ajax.status == 200){
            var jsonRez = ajax.responseText;
            var lines = jsonRez.split('\n'); 
            lines[29] = " ";
            lines[29] = "<td id = \"zauzecePrvaOsoba\" class = \"kolonaSala\"> U kancelariji </td>";
            
            lines[33] = " ";
            lines[33] = "<td id = \"zauzeceDrugaOsoba\" class = \"kolonaSala\"> U kancelariji </td>";
            
            lines[37] = " ";
            lines[37] = "<td id = \"zauzeceTrecaOsoba\" class = \"kolonaSala\"> U kancelariji </td>";
            db.rezervacija.findAll().then(function(rez){
                sveRezervacije = rez;
                db.termin.findAll().then(function(rez){
                    sviTermini = rez;
                    let dt = new Date();
                    let trenutnoVrijeme = dt.toLocaleTimeString('en-US', { hour12: false, 
                        hour: "numeric", 
                        minute: "numeric"});
                    let aaa = dt.getDate() + "." + dt.getMonth()+1 + ".2019";
                    let trenutniDatum = aaa.split(".");
                    trenutniDatum[2] = '2019';
                    let danKalendarTabela = 0;
                    if (trenutniDatum[1] == "01")   trenutniDatum[1] = 1;
                    for (let i = 0; i < sveRezervacije.length; i++) {
                        for (let j = 0; j < sviTermini.length; j++) {
                            if (sveRezervacije[i]['termin'] == sviTermini[j]['id']) {  //preklapanje termina i rezervacije
                                if (sviTermini[j]['redovni'] == false) {
                                    let ps = sviTermini[j]['datum'];
                                    let parsiraniDatumTermina = ps.split(".");
                                    let vrijemePocetkaTermina = sviTermini[j]['pocetak'];
                                    let vrijemeKrajaTermina = sviTermini[j]['kraj'];
                                    if (parsiraniDatumTermina[0] == trenutniDatum[0] && parsiraniDatumTermina[1] == trenutniDatum[1]) {
                                        //preklapanje datuma
                                        if (preklapanjeTermina(trenutnoVrijeme,vrijemePocetkaTermina,vrijemeKrajaTermina)) {
                                            //preklapa se vrijeme, ispisati salu u tabeli osoba
                                            if (sveRezervacije[i]['osoba'] == 1) {
                                                lines[29] = "";
                                                lines[29] = "<td id = \"zauzecePrvaOsoba\" class = \"kolonaSala\">" + SALE[sveRezervacije[i]['sala']] + "</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe1");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 2) {
                                                lines[33] = "";
                                                lines[33] = "<td id = \"zauzeceDrugaOsoba\" class = \"kolonaSala\">" + SALE[sveRezervacije[i]['sala']] + "</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe2");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 3) {
                                                lines[37] = "";
                                                lines[37] = "<td id = \"zauzeceTrecaOsoba\" class = \"kolonaSala\">" + SALE[sveRezervacije[i]['sala']] + "</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe3");
                                                }); 
                                            }
                                        }
                                        else {
                                            //ne preklapa se vrijeme, ne radi ništa jer je hardkodirano "U kancelariji" da piše
                                            if (sveRezervacije[i]['osoba'] == 1) {
                                                lines[29] = "";
                                                lines[29] = "<td id = \"zauzecePrvaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe1 jer nema termina, vanredno");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 2) {
                                                lines[33] = "";
                                                lines[33] = "<td id = \"zauzeceDrugaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe2 jer nema termina, vanredno");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 3) {
                                                lines[37] = "";
                                                lines[37] = "<td id = \"zauzeceTrecaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe3 jer nema termina, vanredno");
                                                }); 
                                            }
                                        }
                                    }
                                    else {
                                        //ne preklapa se datum, ne radi ništa jer je hardkodirano "U kancelariji" da piše
                                        if (sveRezervacije[i]['osoba'] == 1) {
                                            lines[29] = "";
                                            lines[29] = "<td id = \"zauzecePrvaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                            fs.writeFile("./public/osobe.html"," ", function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                            }); 
                                            let rezultatniHTML = "";
                                            for (let i = 0; i < lines.length; i++) {
                                                rezultatniHTML += lines[i] + "\n";
                                            }
                                            fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                console.log("Ažurirao fajl osobe.html zbog osobe1 jer nema termina, vanredno");
                                            }); 
                                        }
                                        else if (sveRezervacije[i]['osoba'] == 2) {
                                            lines[33] = "";
                                            lines[33] = "<td id = \"zauzeceDrugaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                            
                                            fs.writeFile("./public/osobe.html"," ", function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                            }); 
                                            let rezultatniHTML = "";
                                            for (let i = 0; i < lines.length; i++) {
                                                rezultatniHTML += lines[i] + "\n";
                                            }
                                            fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                console.log("Ažurirao fajl osobe.html zbog osobe2 jer nema termina, vanredno");
                                            }); 
                                        }
                                        else if (sveRezervacije[i]['osoba'] == 3) {
                                            lines[37] = "";
                                            lines[37] = "<td id = \"zauzeceTrecaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                            
                                            fs.writeFile("./public/osobe.html"," ", function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                            }); 
                                            let rezultatniHTML = "";
                                            for (let i = 0; i < lines.length; i++) {
                                                rezultatniHTML += lines[i] + "\n";
                                            }
                                            fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                console.log("Ažurirao fajl osobe.html zbog osobe3 jer nema termina, vanredno");
                                            }); 
                                        }
                                    }
                                }
                                else {
                                    //redovno zauzeće
                                    if (trenutniDatum[1] >= 10 && trenutniDatum[1] <= 12 || trenutniDatum[1] == 1) {
                                        //zimski semestar trenutno
                                        if (sviTermini[j]['semestar'] == "zimski") {
        
                                            if (trenutniDatum[1] == 10) {
                                                //oktobar
                                                if(trenutniDatum[0] % 7 == 5) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 6) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 2) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 6;}
                                            }
                                            else if (trenutniDatum[1] == 11) {
                                                //novembar
                                                if(trenutniDatum[0] % 7 == 2) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 6) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 6;}
                                            }
                                            else if (trenutniDatum[1] == 12) {
                                                //decembar
                                                if(trenutniDatum[0] % 7 == 0) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 2) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 6) { danKalendarTabela = 6;}
                                            }
                                            else if (trenutniDatum[1] == 1) {
                                                //januar
                                                if(trenutniDatum[0] % 7 == 6) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 2) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 6;}
        
                                            }
                                        }
                                    }
                                    else if (trenutniDatum[1] >= 2 && trenutniDatum[1] <= 6) {
                                        //ljetni semestar trenutno
                                        if (sviTermini[j]['semestar'] == "ljetni") {
                                            if (trenutniDatum[1] == 2) {
                                                //februar 
                                                if(trenutniDatum[0] % 7 == 3) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 6) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 2) { danKalendarTabela = 6;}
                                            }
                                            else if (trenutniDatum[1] == 3) {
                                                //mart
                                                if(trenutniDatum[0] % 7 == 2) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 6) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 6;}
                                            }
                                            else if (trenutniDatum[1] == 4) {
                                                //april
                                                if(trenutniDatum[0] % 7 == 6) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 2) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 6;}
                                            }
                                            else if (trenutniDatum[1] == 5) {
                                                //maj
                                                if(trenutniDatum[0] % 7 == 4) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 6) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 1) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 2) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 6;}
                                            }
                                            else if (trenutniDatum[1] == 6) {
                                                //juni
                                                if(trenutniDatum[0] % 7 == 1) { danKalendarTabela = 0;}
                                                else if (trenutniDatum[0] % 7 == 2) { danKalendarTabela = 1;}
                                                else if (trenutniDatum[0] % 7 == 3) { danKalendarTabela = 2;}
                                                else if (trenutniDatum[0] % 7 == 4) { danKalendarTabela = 3;}
                                                else if (trenutniDatum[0] % 7 == 5) { danKalendarTabela = 4;}
                                                else if (trenutniDatum[0] % 7 == 6) { danKalendarTabela = 5;}
                                                else if (trenutniDatum[0] % 7 == 0) { danKalendarTabela = 6;}
                                            }
                                        }
                                    }
                                    if (sviTermini[j]['dan'] == danKalendarTabela) {
                                        //trenutno je taj dan aktivan, ispiši salu u kojoj je osoba ako je termin trenutno taj
                                        let vrijemePocetkaTermina = sviTermini[j]['pocetak'];
                                        let vrijemeKrajaTermina = sviTermini[j]['kraj'];
                                        if (preklapanjeTermina(trenutnoVrijeme,vrijemePocetkaTermina,vrijemeKrajaTermina)) {
                                            //preklapa se vrijeme, ispisati salu u tabeli osoba
                                            if (sveRezervacije[i]['osoba'] == 1) {
                                                lines[29] = "";
                                                lines[29] = "<td id = \"zauzecePrvaOsoba\" class = \"kolonaSala\">" + SALE[sveRezervacije[i]['sala']] + "</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe1");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 2) {
                                                lines[33] = "";
                                                lines[33] = "<td id = \"zauzeceDrugaOsoba\" class = \"kolonaSala\">" + SALE[sveRezervacije[i]['sala']] + "</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe2");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 3) {
                                                lines[37] = "";
                                                lines[37] = "<td id = \"zauzeceTrecaOsoba\" class = \"kolonaSala\">" + SALE[sveRezervacije[i]['sala']] + "</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe3");
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                            }
                                        }
                                        else {
                                            //ne preklapa se vrijeme, ne radi ništa jer je hardkodirano "U kancelariji" da piše
                                            if (sveRezervacije[i]['osoba'] == 1) {
                                                lines[29] = "";
                                                lines[29] = "<td id = \"zauzecePrvaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe1 jer nema termina, periodicna");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 2) {
                                                lines[33] = "";
                                                lines[33] = "<td id = \"zauzeceDrugaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe2 jer nema termina, periodicna");
                                                }); 
                                            }
                                            else if (sveRezervacije[i]['osoba'] == 3) {
                                                lines[37] = "";
                                                lines[37] = "<td id = \"zauzeceTrecaOsoba\" class = \"kolonaSala\"> U kancelariji</td>";
                                                
                                                fs.writeFile("./public/osobe.html"," ", function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                }); 
                                                let rezultatniHTML = "";
                                                for (let i = 0; i < lines.length; i++) {
                                                    rezultatniHTML += lines[i] + "\n";
                                                }
                                                fs.writeFile("./public/osobe.html",rezultatniHTML, function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("Ažurirao fajl osobe.html zbog osobe3 jer nema termina, periodicna");
                                                }); 
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }  
        )}
    }
    ajax.open("GET","http://localhost:8080/osobe",true);
    ajax.send();
};


function osvjezi() {
    upisiOsobeuTabelu();   
    setTimeout(osvjezi, 30000);
    console.log("Osvježio sam stranicu, ne brini!");
    };
    
osvjezi();
    

function preklapanjeTermina(trenutnoVrijeme, termin_pocetak, termin_kraj){
    var satnica_TV = trenutnoVrijeme.split(':');
    satnica_TV[0] = parseInt(satnica_TV[0]);
    satnica_TV[1] = parseInt(satnica_TV[1]);
    var ukupneMinute_TV = satnica_TV[0] * 60 + satnica_TV[1];
// termin koji želimo da rezervišemo
    var terminP = termin_pocetak.split(':');
    terminP[0] = parseInt(terminP[0]);
    terminP[1] = parseInt(terminP[1]);
    var ukupneMinute_terminP = terminP[0] * 60 + terminP[1];
    var terminK = termin_kraj.split(':');
    terminK[0] = parseInt(terminK[0]);
    terminK[1] = parseInt(terminK[1]);
    var ukupneMinute_terminK = terminK[0] * 60 + terminK[1];
    return ukupneMinute_TV >= ukupneMinute_terminP && ukupneMinute_TV < ukupneMinute_terminK;
};
 
module.exports = {
    upis: upisiOsobeuTabelu(),
    refresh: osvjezi()
}