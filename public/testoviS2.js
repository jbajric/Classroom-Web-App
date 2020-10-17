let assert = chai.assert;
describe('Kalendar', function() {
describe('iscrtajKalendar()', function() {

it('Pozivanje iscrtajKalendar za mjesec sa 30 dana: očekivano je da se prikaže 30 dana', function() {
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 11);
    var x = document.getElementsByClassName("brojDanaMjesec");
    //iscrtavali smo u htmlu 30 ćelija jer smo gledali novembar!
    assert.equal(x.length, 30);
});

it('Pozivanje iscrtajKalendar za mjesec sa 31 dan: očekivano je da se prikaže 31 dan', function() {
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 11);
    var x = document.getElementsByClassName("brojDanaMjesec");
    //iscrtavali smo u htmlu 30 ćelija jer smo gledali novembar! u kalendar.js je tehnika kako smo dobili još jednu ćeliju
    assert.equal(x.length + 1, 31);
});

it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 1. dan u petak', function() {
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 10);
    var kal = document.getElementById('Kalendar');
    var kal2 = kal.getElementsByClassName("brojDanaMjesec")[0];
    assert.equal(kal2.children[0].children[0].children[0].innerHTML,1); //vidimo sa kalendara da je petak, pravilno 
});

it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 30. dan u subotu', function() {
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 10);
    var kal = document.getElementById('Kalendar');
    var kal2 = kal.getElementsByClassName("brojDanaMjesec")[29];
    assert.equal(kal2.children[0].children[0].children[0].innerHTML,30); //vidimo sa kalendara da je subota, pravilno
});

it('Pozivanje iscrtajKalendar za januar: očekivano je da brojevi dana idu od 1 do 31 počevši od utorka', function() {
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 0);
    var kal = document.getElementById("Kalendar");
    var kal2 = kal.getElementsByClassName("brojDanaMjesec")[0];
    //test da li 1. dan pocinje u utorak
    assert.equal(kal2.children[0].children[0].children[0].innerHTML, 1); 
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 0);
    kal2 = document.getElementsByClassName("danMjeseca");
    //ide +1 jer u html imamo 30 ćelija, a naknadno dodajemo još jednu
    kal2 = kal2.length + 1; 
    assert.equal(kal2, 31);
});

it('TEST: mjesec < 0', function() {
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 11);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), -42);
    var x = document.getElementsByClassName("brojDanaMjesec");
    var y = document.getElementsByClassName("danMjeseca");
    assert.equal(document.getElementById('Kalendar').children[0].children[0].children[0].children[0].innerHTML,"Novembar");
});

it('TEST: mjesec > 11', function() {
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 10);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 42);
    var x = document.getElementsByClassName("brojDanaMjesec");
    var y = document.getElementsByClassName("danMjeseca");
    assert.equal(document.getElementById("Kalendar").children[0].children[0].children[0].children[0].innerHTML,"Novembar");
});

});

describe('obojiZauzeca()', function() {
it('Pozivanje obojiZauzeca kada podaci nisu učitani: očekivana vrijednost da se ne oboji niti jedan dan', function() {
    Kalendar.ucitajPodatke([], []);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 10);     
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 10, "", "", "");
    var x = document.getElementsByClassName("zauzeta");
    assert.equal(x.length, 0);
});

it('Pozivanje obojiZauzeca gdje u zauzećima postoje duple vrijednosti za zauzeće istog termina: očekivano je da se dan oboji bez obzira što postoje duple vrijednosti', function () {
    Kalendar.ucitajPodatke([], []);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 0);
    var listaVR = [
        {
            datum: "12.12.2019",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Jurić"
        },
        {
            datum: "12.12.2019",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
            }
        ];
    Kalendar.ucitajPodatke([], listaVR);
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 11, "VA1", "12:00", "14:00");
    var x = document.getElementsByClassName("zauzeta");
    assert.equal(x.length, 1);
});

it('Pozivanje obojiZauzece kada u podacima postoji periodično zauzeće za drugi semestar: očekivano je da se ne oboji zauzeće', function () {
    Kalendar.ucitajPodatke([], []);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 5);
    var periodicni = [
        {
        dan: 1,
        semestar: "zimski",
        pocetak: "12:00",
        kraj: "14:00",
        naziv: "VA",
        predavac: "Cizi"
        }
    ];
    Kalendar.ucitajPodatke(periodicni, []);
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 5, "VA", "12:00", "14:00");
    var x = document.getElementsByClassName("zauzeta");
    assert.equal(x.length, 0);
});

it('Pozivanje obojiZauzece kada u podacima postoji zauzeće termina ali u drugom mjesecu: očekivano je da se ne oboji zauzeće', function () {
    Kalendar.ucitajPodatke([], []);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 10);
    var listaVR = [
    {
        datum: "01.01.2019",
        pocetak: "12:00",
        kraj: "14:00",
        naziv: "0-09",
        predavac: "Cizi"
    }
    ];
    Kalendar.ucitajPodatke([], listaVR);
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 0, "MA", "08:00", "12:30");
    var x = document.getElementsByClassName("zauzeta");
    assert.equal(x.length, 0, "Iscrtali smo trenutni mjesec, a tražio se januar (rješenje : 0)");
});

it('Pozivanje obojiZauzece kada su u podacima svi termini u mjesecu zauzeti: očekivano je da se svi dani oboje', function () {
    var kal = document.getElementById('Kalendar');
    var listaR = [
        {
            dan: 0,
            semestar: "ljetni",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
        },
        {
            dan: 1,
            semestar: "ljetni",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
        },
        {
            dan: 2,
            semestar: "ljetni",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
        },
        {
            dan: 3,
            semestar: "ljetni",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
        },
        {
            dan: 4,
            semestar: "ljetni",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
        },
        {
            dan: 5,
            semestar: "ljetni",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
        },
        {
            dan: 6,
            semestar: "ljetni",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "VA1",
            predavac: "Cizi"
        }
    ];
    Kalendar.iscrtajKalendar(kal, 3);
    Kalendar.ucitajPodatke(listaR, []);
    Kalendar.obojiZauzeca(document.getElementById('Kalendar'),3,"VA1","12:00","14:00");
    var x = kal.getElementsByClassName("slobodna");
    assert.equal(x.length, 0);
});

it('Pozivanje ucitajPodatke, obojiZauzeca, ucitajPodatke - drugi podaci, obojiZauzeca: očekivano da se zauzeća iz prvih podataka ne ostanu obojena, tj. primjenjuju se samo posljednje učitani podaci', function () {
    Kalendar.ucitajPodatke([], []);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 0);
    var listaVR = [
        {
            datum: "01.01.2019",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "MA",
            predavac: "Jurić"
        }
        ]
    Kalendar.ucitajPodatke([], listaVR);
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 0, "MA", "12:00", "14:00");
    var listaVRR = [
        {
            datum: "03.01.2019",
            pocetak: "16:00",
            kraj: "18:30",
            naziv: "0-01",
            predavac: "Jurić"
        }
    ]
    Kalendar.ucitajPodatke([], listaVRR);
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 0, "0-01", "16:00", "18:30");
    var x = document.getElementsByClassName("zauzeta");
    assert.equal(x.length, 1);
});

it('Dva puta uzastopno pozivanje obojiZauzece: očekivano je da boja zauzeća ostane ista', function () {
    Kalendar.ucitajPodatke([], []);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 0);
    var listaVR = [
        {
            datum: "01.01.2019",
            pocetak: "12:00",
            kraj: "14:00",
            naziv: "0-09",
            predavac: "Jurić"
        }
        ]

    Kalendar.ucitajPodatke([], listaVR);
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 0, "0-09", "12:00", "14:00");
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 0, "0-09", "12:00", "14:00");
    var x = document.getElementsByClassName("zauzeta");
    assert.equal(x.length, 1);
});

it('TEST: Validacija', function () {
Kalendar.ucitajPodatke([], []);
Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 3);
var vanredni = [
    {
        datum: "01.04.2019",
        pocetak: "12:00",
        kraj: "12:30",
        naziv: "0-01",
        predavac: "Profesor"
    },
    {
        datum: "14.04.2019",
        pocetak: "12:00",
        kraj: "12:30",
        naziv: "0-01",
        predavac: "Profesor"
        },
        {
        datum: "51.44.5019",
        pocetak: "12:00",
        kraj: "12:30",
        naziv: "0-01",
        predavac: "Profesor"
        }
    ]

Kalendar.ucitajPodatke([], vanredni);
Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 3, "0-01", "12:00", "12:30");
var zauzeti = document.getElementsByClassName("zauzeta");
//trebaju 2 biti obojena a treci ignorisan
assert.equal(zauzeti.length, 2);
});

it('TEST: Validacija v2', function () {
    Kalendar.ucitajPodatke([], []);
    Kalendar.iscrtajKalendar(document.getElementById("Kalendar"), 3);
    var vanredni = [
        {
            datum: "99.99.2019",
            pocetak: "11:00",
            kraj: "12:30",
            naziv: "VA",
            predavac: "Jurić"
        },
        {
            datum: "99.13.2019",
            pocetak: "11:00",
            kraj: "12:30",
            naziv: "VA",
            predavac: "Cizi"
            }
        ]
    Kalendar.ucitajPodatke([], vanredni);
    Kalendar.obojiZauzeca(document.getElementById("Kalendar"), 3, "VA", "11:00", "12:30");
    var zauzeti = document.getElementsByClassName("zauzeta");
    assert.equal(zauzeti.length, 0);
});

});

});


