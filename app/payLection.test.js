const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../db_connection/models/user');
const Lection = require('../db_connection/models/lection');
const Conto = require('../db_connection/models/conto');
const Transaction = require('../db_connection/models/transaction');


describe('POST /api/v2/payLection', function () {
    let userSpy;
    let lectionSpy;
    let contoSpy;

    beforeAll(async () => {
        let std;
        let prf;
        first_p = true;
        first_s = true;
        createUser = jest.spyOn(User.prototype, 'save').mockImplementation();
        createLection = jest.spyOn(Lection.prototype, 'save').mockImplementation();
        createConto = jest.spyOn(Conto.prototype, 'save').mockImplementation();
        createTransaction = jest.spyOn(Transaction.prototype, 'save').mockImplementation();

        userSpy = jest.spyOn(User, 'findOne').mockImplementation((json) => {
            if (json.username == "prf"){
                if(first_p){
                    prf =  new User({
                        
                        username: "prf",
                        
                    });
                    conto_prf = new Conto({
                        totale: 0,
                        transazioni: [],
                        owner: prf._id
                    });
                    prf.conto = conto_prf._id;
                    first_p = false;
                }
                return prf
            }
            else{
                if(first_s){
                    std =  new User({
                        username: "std",
                    
                    });
                    conto_std = new Conto({
                        totale: 10,
                        transazioni: [],
                        owner: std._id
                    });
                    std.conto = conto_std._id;
                    first_s = false;
                }
                return std
            }
        });

        lectionSpy = jest.spyOn(Lection, 'findOne').mockImplementation((json) => {

            if (json._id == "not_booked")
                return new Lection({
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: false,
                    paid: false,
                    prezzo: 20,
                    owner: "prf",
                    _id: "629a26abbd66ab87c123f9bb"
                });
            else if (json._id == "wrong_id")
                return null;
            else if (json._id == "paid")
                return new Lection( {
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: true,
                    prezzo: 20,
                    owner: "prf",
                    _id: "629a26abbd66ab87c123f9bb"
                });
            else if (json._id == "lect_id")
                return new Lection({
                    student_username: "std",
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: false,
                    prezzo: 10,
                    owner: "prf",
                    _id: "lect_id"
                });
            else
                return new Lection({
                    student_username: "std",
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: false,
                    prezzo: 20,
                    owner: "prf",
                    _id: "lect_id_exp"
                });
        });
        contoSpy = jest.spyOn(Conto, 'findOne').mockImplementation((json) => {
            if(json._id == prf.conto)
                return new Conto({
                    totale: 0,
                    transazioni: [],
                    owner: prf._id,
                    _id: prf.conto
                });
            else if (json._id == std.conto)
                return new Conto({
                    totale: 10,
                    transazioni: [],
                    owner: std._id,
                    _id: std.conto
                });

        });

    });

    afterAll(() => {

        userSpy.mockRestore();
        lectionSpy.mockRestore();
    });


    var token = jwt.sign(
        { email: 'std1@std.com', id: 'std', username: 'std' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );

    var tokenP = jwt.sign(
        { email: 'prf1@prf.com', id: 'prf', username: 'prf' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );
    test('POST /api/v2/payLection senza aver effettuato l accesso', () => {
        return request(app)
            .post('/api/v2/payLection')
            .set('Cookie', ['token=""'])
            .set('Accept', 'application/json')
            .expect(400, { message: 'Serve effettuare il Login' });
    });

    test('POST /api/v2/payLection con lezione non esistente', () => {
        return request(app)
            .post('/api/v2/payLection')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'wrong_id' })
            .expect(400, { message: 'Errore, lezione non trovata.' });
    });

    test('POST /api/v2/payLection come professore', () => {
        return request(app)
            .post('/api/v2/payLection')
            .set('Cookie', ['token=' + tokenP])
            .set('Accept', 'application/json')
            .send({ lection_id: 'not_booked' })
            .expect(400, { message: 'Errore, non ancora prenotata.' });
    });

    test('POST /api/v2/payLection con lezione già prenotata', () => {
        return request(app)
            .post('/api/v2/payLection')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'paid' })
            .expect(400, { message: 'Errore, lezione già pagata.' });
    });

    test('POST /api/v2/payLection con valore conto inferiore prezzo lezione', () => {
        return request(app)
            .post('/api/v2/payLection')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_id_exp' })
            .expect(400, { message: 'Errore, il tuo saldo non è sufficiente per pagare la lezione.' });
    });

    test('POST /api/v2/payLection correttamente', () => {
        return request(app)
            .post('/api/v2/payLection')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_id' })
            .expect(200, { message: 'Transazione effettuata correttamente.' });
    });

});






