const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../db_connection/models/user');
const Lection = require('../db_connection/models/lection');
const Conto = require('../db_connection/models/conto');

describe('POST /api/v2/payLection', function () {
    let userSpy;
    let lectionSpy;
    let contoSpy;

    beforeAll(async () => {

        userSpy = jest.spyOn(User, 'findOne').mockImplementation((json) => {

            if (json.username == "prf")
                return {
                    conto: "conto_prf"
                };
            else
                return {
                    conto: "conto_std"
                };
        });
        lectionSpy = jest.spyOn(Lection, 'findOne').mockImplementation((json) => {

            if (json._id == "not_booked")
                return {
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: false,
                    paid: false,
                    prezzo: 20,
                    owner: "629a26abbd66ab87c123f9ba",
                    _id: "629a26abbd66ab87c123f9bb"
                };
            else if (json._id == "wrong_id")
                return null;
            else if (json._id == "paid")
                return {
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: true,
                    prezzo: 20,
                    owner: "prf",
                    _id: "629a26abbd66ab87c123f9bb"
                };
            else
                return {
                    student_username: "std",
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: false,
                    prezzo: 20,
                    owner: "prf",
                    _id: "629a326382701e0773c38f67"
                };
        });
        contoSpy = jest.spyOn(Conto, 'findOne').mockImplementation((json) => {

            return {
                totale: 10
            };

        });

    });

    afterAll(() => {
        // mongoose.connection.close(true);
        // console.log("Database connection closed");
        userSpy.mockRestore();
        lectionSpy.mockRestore();
    });


    var token = jwt.sign(
        { email: 'std1@std.com', id: '629a26abbd66ab87c123f9ba', username: 'std1' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );

    var tokenP = jwt.sign(
        { email: 'prf1@prf.com', id: '629a26abbd66ab87c123f9ba', username: 'prf1' },
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

    test('POST /api/v2/payLection con valore coto inferiore prezzo lezione', () => {
        return request(app)
            .post('/api/v2/payLection')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: '629a326382701e0773c38f67' })
            .expect(400, { message: 'Errore, il tuo saldo non è sufficiente per pagare la lezione.' });
    });



});






