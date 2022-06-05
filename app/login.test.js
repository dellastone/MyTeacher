const fetch = require("node-fetch");
const app = require('../app/app');
const supertest = require('supertest');
const request = supertest(app);

const url = process.env.HEROKU || "http://localhost:8080";

/**
 * Login test cases:
 *  1. no email == first check, same for no data
 *  2. wrong email == no user with this email in the db
 *  3. no password
 *  4. wrong password
 *  5. correct data login
 */

const username = mariorossi;
const no_email = {};
const wrong_email = {
    email: 'mariopossi@gmail.com'
};
const no_password = {
    email: 'mariorossi@gmail.com'
};
const wrong_password = {
    email: 'mariorossi@gmail.com',
    password: 'Professore11!'
};

const correct_login = {
    email: 'mariorossi@gmail.com',
    password: 'Professore00!'
};

describe('POST /api/v2/users/auth', () => {

    let loginSpy;

    beforeAll(() => {
        const User = require('../db_connection/models/user');

        //timer per jest
        jest.setTimeout(8000); 

        loginSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
            return false;
        });
    });

    afterAll(async () => {
        loginSpy.mockRestore();
    });

    // email non inserita (utente non trovato nel sistema).
    test('POST /api/v2/users/auth senza inserire una mail deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(no_email)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Errore, utente non trovato.");
    });

    // email inserita non valida (utente non trovato nel sistema).
    test('POST /api/v2/users/auth inserendo una mail non appartente a nessun utente deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrong_email)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Errore, utente non trovato.");
    });


    loginSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
        return {
            id: "629721d01b5e2729da0afc63",
            username: 'mariorossi',
            email: 'mariorossi@gmail.com',
            nome: 'Mario',
            cognome: 'Rossi',
            salt: '52a9274c3781749d1d9a7e4b952ff431',
            passwordHash: '59c190144aef2fdc877a56668d840f7bbc8ada0ba99062d6f69daba5407b15e72a883fc6575efcac3583ed850c4808858ab03c4e12a8a63bc6ef3d366b10aeff',
            professore: true
        };
    });
    
    // password non inserita.
    test('POST /api/v2/users/auth senza inserire la password deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(no_password)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Errore, password errata.");
    });

    // password inserita non corretta.
    test('POST /api/v2/users/auth inserendo una password non corretta deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrong_password)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Errore, password errata.");
    });

    // email e password corretti corrispondenti ad un account registrato nel sistema.
    test('POST /api/v2/users/auth inserendo una password non corretta deve ritornare 200', async () => {
        expect.assertions(4);
        const res = await fetch(url + '/api/v2/users/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(correct_login)
        });
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.message).toBe("Login effettuato.");
        expect(json.token);
        expect(json.self).toBe("api/v2/users/"+username);
    });

});

