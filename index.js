const express = require('express');
var app = express();
const fs = require('fs');
app.use(express.static('public'));
const port = 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const tabelaOsoblje = require('./public/tabelaOsoblje');


app.get("/svaZauzeca", function(req, res) {
    const db = require("./db");
    db.rezervacija.findAll().then(function(sveRez){
        let rezervacije = [];
        for (let i = 0; i<sveRez.length; i++) {
            let x = {
                id: sveRez[i].id,
                termin: sveRez[i].termin,
                sala: sveRez[i].sala,
                osoba: sveRez[i].osoba,
            };
            rezervacije.push(x);
        }
        res.json(rezervacije);
    });
});

app.post('/dodajZauzece',function(req,res) {
    const db = require("./db");
    let osobaID, terminID, salaID = "";
    let datum = req.body.datum;
    let parsiraniDatum = datum.split(".");
    let semestar = req.body.semestar;
    let pocetakTermina = req.body.pocetakTermina;
    let krajTermina = req.body.krajTermina;
    let nazivSale = req.body.nazivSale;
    let pp = req.body.predavac;
    let predavac = pp.split(" ");
    let periodicnost = req.body.periodicnost;
    if (periodicnost) {
        //periodično zauzeće: dan semestar pocetak kraj naziv predavac
        let prviDan = (new Date(2019, parsiraniDatum[1])).getDay();
        if (prviDan - 1 < 0)
            prviDan += 7;
        let x = parsiraniDatum[0] % 7 + prviDan;
        if (semestar == "zimski") {
            if (parsiraniDatum[1] == 10) {
                //oktobar
                x -= 5;
            }
            else if (parsiraniDatum[1] == 11) {
                //novembar
                console.log(x);
                if (x == 11) { x = 0;}
                else if (x == 12) { x = 1;}
                else if (x == 13) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 8) { x = 4;}
                else if (x == 9) { x = 5;}
                else if (x == 10) { x = 6;}
            }
            else if (parsiraniDatum[1] == 12) {
                //decembar
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 3) { x = 5;}
                else if (x == 4) { x = 6;}
            }
            else if (parsiraniDatum[1] == 1) {
                //januar
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 10) { x = 5;}
                else if (x == 11) { x = 6;}
            }
        }
        else if (semestar == "ljetni") {
            if (parsiraniDatum[1] == 2) {
                //februar
                if (x == 9) { x = 0;}
                else if (x == 10) { x = 1;}
                else if (x == 11) { x = 2;}
                else if (x == 5) { x = 3;}
                else if (x == 6) { x = 4;}
                else if (x == 7) { x = 5;}
                else if (x == 8) { x = 6;}
            }
            else if (parsiraniDatum[1] == 3) {
                //mart
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 1) { x = 3;}
                else if (x == 2) { x = 4;}
                else if (x == 3) { x = 5;}
                else if (x == 4) { x = 6;}
            }
            else if (parsiraniDatum[1] == 4) {
                //april
                if (x == 4) { x = 0;}
                else if (x == 5) { x = 1;}
                else if (x == 6) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 8) { x = 4;}
                else if (x == 9) { x = 5;}
                else if (x == 3) { x = 6;}
            }
            else if (parsiraniDatum[1] == 5) {
                //maj
                if (x == 12) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 10) { x = 5;}
                else if (x == 11) { x = 6;}
            }
            else if (parsiraniDatum[1] == 6) {
                //juni
                if (x == 4) { x = 0;}
                else if (x == 5) { x = 1;}
                else if (x == 6) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 1) { x = 4;}
                else if (x == 2) { x = 5;}
                else if (x == 3) { x = 6;}
            }
        }
        db.osoblje.findOne({where: {ime: predavac[0], prezime: predavac[1]}}).then(function(nekaOsoba){
            osobaID = nekaOsoba.id;
            db.sala.findOne({where: {naziv: nazivSale, zaduzenaOsoba: osobaID}}).then(function(nekaSala) {
                salaID = nekaSala.id;
                db.termin.create({redovni: true, dan: x, datum: null, semestar: semestar, pocetak: pocetakTermina, kraj: krajTermina}).then(function(argumenti){
                    terminID = argumenti.dataValues.id;
                    db.rezervacija.create({termin: terminID, sala: salaID, osoba: osobaID}).then(function (preostalo){
                        res.end();
                    })
                })
            })
        })
    }
    else {
        //vanredno zauzeće: datum pocetak kraj naziv predavac
        db.osoblje.findOne({where: {ime: predavac[0], prezime: predavac[1]}}).then(function(nekaOsoba){
            osobaID = nekaOsoba.id;
            db.sala.findOne({where: {naziv: nazivSale, zaduzenaOsoba: osobaID}}).then(function(nekaSala) {
                salaID = nekaSala.id;
                db.termin.create({redovni: false, dan: null, datum: datum, semestar: null, pocetak: pocetakTermina, kraj: krajTermina}).then(function(argumenti){
                    terminID = argumenti.dataValues.id;
                    db.rezervacija.create({termin: terminID, sala: salaID, osoba: osobaID}).then(function (preostalo){
                        res.end();
                    })
                })
            })
        })
    }
    }
);

app.get("/osobe", function(req, res) {
    res.sendFile(__dirname + "/public/osobe.html");
});


app.get("/osoblje", function(req, res) {
    const db = require("./db");
    db.osoblje.findAll().then(function(sveOsobe){
        let osobe = [];
        for (let i = 0; i<sveOsobe.length; i++) {
            let x = {
                id: sveOsobe[i].id,
                ime: sveOsobe[i].ime,
                prezime: sveOsobe[i].prezime,
                uloga: sveOsobe[i].uloga
            };
            osobe.push(x);
        }
        res.json(osobe);
    });
});

app.get("/sveSale", function(req, res) {
    const db = require("./db");
    db.sala.findAll().then(function(sveSale){
        let sale = [];
        for (let i = 0; i<sveSale.length; i++) {
            let x = {
                id: sveSale[i].id,
                naziv: sveSale[i].naziv,
                zaduzenaOsoba: sveSale[i].zaduzenaOsoba
            };
            sale.push(x);
        }
        res.json(sale);
    });
});


app.post('/public/zauzeca.json',function(req,res) {
    let datum = req.body.datum;
    let parsiraniDatum = datum.split(".");
    let semestar = req.body.semestar;
    let pocetakTermina = req.body.pocetakTermina;
    let krajTermina = req.body.krajTermina;
    let nazivSale = req.body.nazivSale;
    let predavac = req.body.predavac;
    let periodicnost = req.body.periodicnost;
    if (periodicnost) {
        //periodično zauzeće: dan semestar pocetak kraj naziv predavac
        let prviDan = (new Date(2019, parsiraniDatum[1])).getDay();
        if (prviDan - 1 < 0)
            prviDan += 7;
        let x = parsiraniDatum[0] % 7 + prviDan;
        if (semestar == "zimski") {
            if (parsiraniDatum[1] == 10) {
                //oktobar
                x -= 5;
            }
            else if (parsiraniDatum[1] == 11) {
                //novembar
                console.log(x);
                if (x == 11) { x = 0;}
                else if (x == 12) { x = 1;}
                else if (x == 13) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 8) { x = 4;}
                else if (x == 9) { x = 5;}
                else if (x == 10) { x = 6;}
            }
            else if (parsiraniDatum[1] == 12) {
                //decembar
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 3) { x = 5;}
                else if (x == 4) { x = 6;}
            }
            else if (parsiraniDatum[1] == 1) {
                //januar
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 10) { x = 5;}
                else if (x == 11) { x = 6;}
            }
        }
        else if (semestar == "ljetni") {
            if (parsiraniDatum[1] == 2) {
                //februar
                if (x == 9) { x = 0;}
                else if (x == 10) { x = 1;}
                else if (x == 11) { x = 2;}
                else if (x == 5) { x = 3;}
                else if (x == 6) { x = 4;}
                else if (x == 7) { x = 5;}
                else if (x == 8) { x = 6;}
            }
            else if (parsiraniDatum[1] == 3) {
                //mart
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 1) { x = 3;}
                else if (x == 2) { x = 4;}
                else if (x == 3) { x = 5;}
                else if (x == 4) { x = 6;}
            }
            else if (parsiraniDatum[1] == 4) {
                //april
                if (x == 4) { x = 0;}
                else if (x == 5) { x = 1;}
                else if (x == 6) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 8) { x = 4;}
                else if (x == 9) { x = 5;}
                else if (x == 3) { x = 6;}
            }
            else if (parsiraniDatum[1] == 5) {
                //maj
                if (x == 12) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 10) { x = 5;}
                else if (x == 11) { x = 6;}
            }
            else if (parsiraniDatum[1] == 6) {
                //juni
                if (x == 4) { x = 0;}
                else if (x == 5) { x = 1;}
                else if (x == 6) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 1) { x = 4;}
                else if (x == 2) { x = 5;}
                else if (x == 3) { x = 6;}
            }
        }
        let string = {dan: x, semestar: semestar, pocetak: pocetakTermina, kraj: krajTermina, naziv: nazivSale, predavac: predavac};
        fs.readFile(__dirname + "/public/zauzeca.json", (error,proizvoljno)=>{
            if(error){
                throw error;
            }
            let jsonRez  = JSON.parse(proizvoljno);
            let vanJson=jsonRez.periodicna;
            vanJson.push(string);
            fs.writeFile(__dirname + '/public/zauzeca.json', JSON.stringify(jsonRez), function(err) {});
            res.send(jsonRez);
        })
    }
    else {
        //vanredno zauzeće: datum pocetak kraj naziv predavac
        let string = {datum: datum, pocetak: pocetakTermina, kraj: krajTermina, naziv: nazivSale, predavac: predavac};
        fs.readFile(__dirname + "/public/zauzeca.json", (error,proizvoljno)=>{
            if(error){
                throw error;
            }
            let jsonRez  = JSON.parse(proizvoljno);
            let vanJson=jsonRez.vanredna;
            vanJson.push(string);
            fs.writeFile(__dirname + '/public/zauzeca.json', JSON.stringify(jsonRez), function(err) {});
            res.send(jsonRez);
        })
    }
    });


app.get("/unos", function(req, res) {
    res.sendFile(__dirname + "/public/unos.html");
});

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/public/pocetna.html");
})

app.get("/rezervacija", function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/zauzeca.json");
    res.send(proizvoljno);
});

app.get("/pocetna", function(req, res) {
    res.write('slika1.png slika2.png slika3.png slika4.png slika5.png slika6.png slika7.png slika8.png slika9.png slika10.png');
    res.send();
});

app.get("/sale", function(req, res) {
    res.sendFile(__dirname + "/public/sale.html");
});

app.get("/zauzeca.json", function(req,res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/zauzeca.json");
    res.send(proizvoljno);
});

app.get("/slika1.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika1.png");
    res.send(proizvoljno);
});
app.get("/slika2.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika2.png");
    res.send(proizvoljno);
});
app.get("/slika3.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika3.png");
    res.send(proizvoljno);
});
app.get("/slika4.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika4.png");
    res.send(proizvoljno);
});
app.get("/slika5.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika5.png");
    res.send(proizvoljno);
});
app.get("/slika6.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika6.png");
    res.send(proizvoljno);
});
app.get("/slika7.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika7.png");
    res.send(proizvoljno);
});
app.get("/slika8.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika8.png");
    res.send(proizvoljno);
});
app.get("/slika9.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika9.png");
    res.send(proizvoljno);
});
app.get("/slika10.png",function(req, res) {
    var proizvoljno = fs.readFileSync(__dirname + "/public/slika10.png");
    res.send(proizvoljno);
});

module.exports = app;
app.listen(port);

/*app.post('/zauzeca.json',function(req,res) {  PREKO JSON
    let datum = req.body.datum;
    let parsiraniDatum = datum.split(".");
    let semestar = req.body.semestar;
    let pocetakTermina = req.body.pocetakTermina;
    let krajTermina = req.body.krajTermina;
    let nazivSale = req.body.nazivSale;
    let predavac = req.body.predavac;
    let periodicnost = req.body.periodicnost;
    if (periodicnost) {
        //periodično zauzeće: dan semestar pocetak kraj naziv predavac
        let prviDan = (new Date(2019, parsiraniDatum[1])).getDay();
        if (prviDan - 1 < 0)
            prviDan += 7;
        let x = parsiraniDatum[0] % 7 + prviDan;
        if (semestar == "zimski") {
            if (parsiraniDatum[1] == 10) {
                //oktobar
                x -= 5;
            }
            else if (parsiraniDatum[1] == 11) {
                //novembar
                if (x == 11) { x = 0;}
                else if (x == 12) { x = 1;}
                else if (x == 13) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 8) { x = 4;}
                else if (x == 9) { x = 5;}
                else if (x == 10) { x = 6;}
            }
            else if (parsiraniDatum[1] == 12) {
                //decembar
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 3) { x = 5;}
                else if (x == 4) { x = 6;}
            }
            else if (parsiraniDatum[1] == 1) {
                //januar
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 10) { x = 5;}
                else if (x == 11) { x = 6;}
            }
        }
        else if (semestar == "ljetni") {
            if (parsiraniDatum[1] == 2) {
                //februar
                if (x == 9) { x = 0;}
                else if (x == 10) { x = 1;}
                else if (x == 11) { x = 2;}
                else if (x == 5) { x = 3;}
                else if (x == 6) { x = 4;}
                else if (x == 7) { x = 5;}
                else if (x == 8) { x = 6;}
            }
            else if (parsiraniDatum[1] == 3) {
                //mart
                if (x == 5) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 1) { x = 3;}
                else if (x == 2) { x = 4;}
                else if (x == 3) { x = 5;}
                else if (x == 4) { x = 6;}
            }
            else if (parsiraniDatum[1] == 4) {
                //april
                if (x == 4) { x = 0;}
                else if (x == 5) { x = 1;}
                else if (x == 6) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 8) { x = 4;}
                else if (x == 9) { x = 5;}
                else if (x == 3) { x = 6;}
            }
            else if (parsiraniDatum[1] == 5) {
                //maj
                if (x == 12) { x = 0;}
                else if (x == 6) { x = 1;}
                else if (x == 7) { x = 2;}
                else if (x == 8) { x = 3;}
                else if (x == 9) { x = 4;}
                else if (x == 10) { x = 5;}
                else if (x == 11) { x = 6;}
            }
            else if (parsiraniDatum[1] == 6) {
                //juni
                if (x == 4) { x = 0;}
                else if (x == 5) { x = 1;}
                else if (x == 6) { x = 2;}
                else if (x == 7) { x = 3;}
                else if (x == 1) { x = 4;}
                else if (x == 2) { x = 5;}
                else if (x == 3) { x = 6;}
            }
        }
        let string = {dan: x, semestar: semestar, pocetak: pocetakTermina, kraj: krajTermina, naziv: nazivSale, predavac: predavac};
        fs.readFile(__dirname + "/public/zauzeca.json", (error,proizvoljno)=>{
            if(error){
                throw error;
            }
            let jsonRez  = JSON.parse(proizvoljno);
            let vanJson=jsonRez.periodicna;
            vanJson.push(string);
            fs.writeFile(__dirname + '/public/zauzeca.json', JSON.stringify(jsonRez), function(err) {});
            res.send(jsonRez);
        })
    }
    else {
        //vanredno zauzeće: datum pocetak kraj naziv predavac
        let string = {datum: datum, pocetak: pocetakTermina, kraj: krajTermina, naziv: nazivSale, predavac: predavac};
        fs.readFile(__dirname + "/public/zauzeca.json", (error,proizvoljno)=>{
            if(error){
                throw error;
            }
            let jsonRez  = JSON.parse(proizvoljno);
            let vanJson=jsonRez.vanredna;
            vanJson.push(string);
            fs.writeFile(__dirname + '/public/zauzeca.json', JSON.stringify(jsonRez), function(err) {});
            res.send(jsonRez);
        })
    }
    });*/
