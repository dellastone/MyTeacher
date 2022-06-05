const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../db_connection/models/user');
const Lection = require('../db_connection/models/lection');

describe('POST /api/v2/prenota', function () {
    let userSpy;
    let lectionSpy;
   
    beforeAll(async () => {

        userSpy = jest.spyOn(User, 'findOne').mockImplementation((json) => {
            
            if(json.username == "prf1")
                return {
                    _id: "629a26abbd66ab87c123f9ba",
                    email: 'prf1@prf.com',
                    username: 'prf1',
                    professore: true
                };
            else
                return {
                    _id: "629a26abbd66ab87c123f9ba",
                    email: 'prf1@prf.com',
                    username: 'prf1',
                    professore: false
                };
        });
        lectionSpy = jest.spyOn(Lection, 'findOne').mockImplementation((json) => {
            
            if(json._id == "629a26abbd66ab87c123f9bb")
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
            else
                return {
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: false,
                    prezzo: 20,
                    owner: "629a26abbd66ab87c123f9ba",
                    _id: "629a326382701e0773c38f67"
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
    test('POST /api/v2/prenota senza aver effettuato l accesso', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=""'])
            .set('Accept', 'application/json')
            .send({ lection_id: '629a26abbd66ab87c123f9bb' })
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
    
    test('POST /api/v2/prenota come professore', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + tokenP])
            .set('Accept', 'application/json')
            .send({ lection_id: '629a26abbd66ab87c123f9bb' })
            .expect(400, { message: 'Errore, il professore non può prenotare la lezione.' });
    });

    test('POST /api/v2/prenota con lezione già prenotata', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: '629a326382701e0773c38f67' })
            .expect(400, { message: 'Errore, lezione già prenotata.' });
    });


   
});


describe('DELETE /api/v2/prenota', function () {
    let userSpy;
    let lectionSpy;
   

    beforeAll(async () => {

        lectionSpy = jest.spyOn(Lection, 'findOne').mockImplementation((json) => {
            if(json._id == "wrong_id")
                return null;
            else
                return {
                    student_username: "std",
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: false,
                    prezzo: 20,
                    owner: "629a26abbd66ab87c123f9ba",
                    _id: "629a26abbd66ab87c123f9bb"
                };
           
        });

       
    });
       


    afterAll(() => {
        // mongoose.connection.close(true);
        // console.log("Database connection closed");
        lectionSpy.mockRestore();
    });


    var token = jwt.sign(
        { email: 'std1@std.com', id: '629a26abbd66ab87c123f9ba', username: 'std1' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );

    test('DELETE /api/v2/prenota senza aver effettuato l accesso', () => {
        return request(app)
            .delete('/api/v2/prenota')
            .set('Cookie', ['token=""'])
            .set('Accept', 'application/json')
            .send({ lection_id: '629a26abbd66ab87c123f9bb' })
            .expect(400, { message: 'Serve effettuare il Login' });
    });

    test('DELETE /api/v2/prenota con lezione non esistente', () => {
        return request(app)
            .delete('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'wrong_id' })
            .expect(400, { message: 'Errore, lezione non trovata.' });
    });
    
    
   
});




