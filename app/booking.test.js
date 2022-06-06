const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens



describe('POST /api/v2/prenota', function () {
    let userSpy;
    let lectionSpy;
    let createUser;
    let createLect;


    beforeAll(async () => {
        const User = require('../db_connection/models/user');
        const Lection = require('../db_connection/models/lection');
        createUser = jest.spyOn(User.prototype, 'save').mockImplementation();
        createLect = jest.spyOn(Lection.prototype, 'save').mockImplementation();


        userSpy = jest.spyOn(User, 'findOne').mockImplementation((json) => {

            if (json.username == "prf1")
                return new User({
                    _id: "userid",
                    email: 'prf1@prf.com',
                    username: 'prf1',
                    professore: true
                });
            else
                return new User({
                    _id: "userid",
                    email: 'prf1@prf.com',
                    username: 'prf1',
                    professore: false,
                    lezioni: [],
                });
        });
        lectionSpy = jest.spyOn(Lection, 'findOne').mockImplementation((json) => {

            if (json._id == "lect_g_id")
                return new Lection({
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: false,
                    paid: false,
                    prezzo: 20,
                    owner: "userid",
                    _id: "lect_g_id"
                });
            else if(json._id == "lect_b_id")
                return new Lection({
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: false,
                    prezzo: 20,
                    owner: "userid",
                    _id: "lect_b_id"
                });
            else
                return null
        });
        

    });

    afterAll(() => {
        userSpy.mockRestore();
        lectionSpy.mockRestore();
        createUser.mockRestore();
        createLect.mockRestore();
    });


    var token = jwt.sign(
        { email: 'std1@std.com', id: 'userid', username: 'std1' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );

    var tokenP = jwt.sign(
        { email: 'prf1@prf.com', id: 'userid', username: 'prf1' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );
    test('POST /api/v2/prenota senza aver effettuato l accesso', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=""'])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_g_id' })
            .expect(400, { message: 'Serve effettuare il Login' });
    });

    test('POST /api/v2/prenota con lezione non esistente', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_w_id' })
            .expect(400, { message: 'Errore, lezione non trovata.' });
    });

    test('POST /api/v2/prenota come professore', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + tokenP])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_g_id' })
            .expect(400, { message: 'Errore, il professore non può prenotare la lezione.' });
    });

    test('POST /api/v2/prenota con lezione già prenotata', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_b_id' })
            .expect(400, { message: 'Errore, lezione già prenotata.' });
    });

    test('POST /api/v2/prenota correttamente', () => {
        return request(app)
            .post('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_g_id' })
            .expect(200, { message: 'lection booked' });
    });



});


describe('DELETE /api/v2/prenota', function () {
    let lectionSpy;


    beforeAll(async () => {
        const Lection = require('../db_connection/models/lection');
        createLect = jest.spyOn(Lection.prototype, 'save').mockImplementation();
        lectionSpy = jest.spyOn(Lection, 'findOne').mockImplementation((json) => {
            if (json._id == "lect_w_id")
                return null;
            else
                return new Lection({
                    student_username: "std",
                    prof_username: "prf",
                    starts: "2021-01-01T12:00:00Z",
                    ends: "2021-01-01T13:00:00Z",
                    booked: true,
                    paid: false,
                    prezzo: 20,
                    owner: "userid",
                    _id: "lect_g_id"
                });

        });


    });



    afterAll(() => {
        // mongoose.connection.close(true);
        // console.log("Database connection closed");
        lectionSpy.mockRestore();
    });


    var token = jwt.sign(
        { email: 'std1@std.com', id: 'userid', username: 'std1' },
        process.env.SUPER_SECRET,
        { expiresIn: 86400 }
    );

    test('DELETE /api/v2/prenota senza aver effettuato l accesso', () => {
        return request(app)
            .delete('/api/v2/prenota')
            .set('Cookie', ['token=""'])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_g_id' })
            .expect(400, { message: 'Serve effettuare il Login' });
    });

    test('DELETE /api/v2/prenota con lezione non esistente', () => {
        return request(app)
            .delete('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_w_id' })
            .expect(400, { message: 'Errore, lezione non trovata.' });
    });
    test('DELETE /api/v2/prenota con lezione non esistente', () => {
        return request(app)
            .delete('/api/v2/prenota')
            .set('Cookie', ['token=' + token])
            .set('Accept', 'application/json')
            .send({ lection_id: 'lect_g_id' })
            .expect(400, { message: 'Errore, lezione non trovata.' });
    });



});




