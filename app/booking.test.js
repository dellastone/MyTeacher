const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');


describe('POST /api/v2/prenota', function () {
    let connection;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected!');
        //return connection; // Need to return the Promise db connection?
    });

    afterAll(() => {
        mongoose.connection.close(true);
        console.log("Database connection closed");
    });
    var token = jwt.sign(
        { email: 'std1@std.com', id: '629a26abbd66ab87c123f9ba', username: 'std1' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );

    var tokenP = jwt.sign(
        { email: 'prf1@prf.com', id: '629a2883bd66ab87c123f9d6', username: 'prf1' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );
    test('POST /api/v2/prenota senza aver effettuato l accesso', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=""'])
            .set('Accept', 'application/json')
            .send({ lection_id: 'correct_id' })
            .expect(400, { message: 'Serve effettuare il Login' });
    });

    test('POST /api/v2/prenota con lezione non esistente', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'wrong_id' })
            .expect(400, { message: 'Errore, lezione non trovata.' });
    });

    test('POST /api/v2/prenota con lezione già prenotata', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: '629a2883bd66ab87c123f9d6' })
            .expect(400, { message: 'Errore, lezione già prenotata.' });
    });

    test('POST /api/v2/prenota come professore', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + tokenP])
            .set('Accept', 'application/json')
            .send({ lection_id: '629a326382701e0773c38f67' })
            .expect(400, {message: 'Errore, il professore non può prenotare la lezione.' });
    });





});