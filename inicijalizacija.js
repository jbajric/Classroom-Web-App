const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija(){

    return new Promise(function(resolve,reject){
    db.osoblje.create({ime:'Neko', prezime: 'Nekic', uloga:'profesor'});
    db.osoblje.create({ime:'Drugi', prezime: 'Neko', uloga:'asistent'});
    db.osoblje.create({ime:'Test', prezime: 'Test', uloga:'asistent'});
    
    db.sala.create({naziv:'1-11', zaduzenaOsoba:1});
    db.sala.create({naziv:'1-15', zaduzenaOsoba:2});

    db.termin.create({redovni:false, dan:null, datum:'01.01.2020',semestar:null, pocetak:'12:00', kraj:'13:00'});
    db.termin.create({redovni:true, dan:0, datum:null,semestar:'zimski', pocetak:'13:00', kraj:'14:00'});

    db.rezervacija.create({termin:1, sala:1, osoba:1});
    db.rezervacija.create({termin:2, sala:1, osoba:3});
    
});
}
