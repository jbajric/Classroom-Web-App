const assert = require ('assert');
const app = require('./index');
const supertest = require('supertest');


//a) dohvatanje osoblja
describe("GET /osoblje", function() {
    it ("Provjera: status code 200", function(done){
        supertest(app)
        .get("/osoblje")
        .expect(200)
        .end(function(error, response){
            if (error)  done(error);
            done();
        });
    });

    it("Provjera: dobili svo osoblje", function(done) {
        supertest(app)
          .get("/osoblje")
          .expect([
            {"id":1,"ime":"Neko","prezime":"Nekic","uloga":"profesor"},
            {"id":2,"ime":"Drugi","prezime":"Neko","uloga":"asistent"},
            {"id":3,"ime":"Test","prezime":"Test","uloga":"asistent"}])
          .end(function(err, res) {
            if (err) done(err);
            done();
          });  
      });
});


//c) dohvatanje sala
describe("GET /sveSale", function() {
    it ("Provjera: status code 200", function(done){
        supertest(app)
        .get("/sveSale")
        .expect(200)
        .end(function(error, response){
            if (error)  done(error);
            done();
        });
    });

    it("Provjera: dobili sve sale", function(done) {
        supertest(app)
          .get("/sveSale")
          .expect([
            {"id":1,"naziv":"1-11","zaduzenaOsoba":1},
            {"id":2,"naziv":"1-15","zaduzenaOsoba":2}])
          .end(function(err, res) {
            if (err) done(err);
            done();
          })});
});

describe("GET /sveRezervacije", function() {
    it("Provjera status koda koji mora biti 200", function(done) {
      supertest(app)
        .get("/svaZauzeca")
        .expect(200)
        .end(function(err, res){
          if (err) done(err);
          done();
        });
    });
  
    it("Provjera: dobili sve rezervacije", function(done) {
      supertest(app)
        .get("/svaZauzeca")
        .expect([
            {"id":1,"termin":1,"sala":1,"osoba":1},
            {"id":2,"termin":2,"sala":1,"osoba":3}])
        .end(function(err, res) {
          if (err) done(err);
          done();
        });  
    });
  });