const fetch = require("node-fetch");
const app = require('../app/app');
const supertest = require('supertest');
const request = supertest(app);

const url = process.env.HEROKU || "http://localhost:3000";

const nousername = {};
const wrong_username = {
    username: '<marior>'
};
const noemail = {
    username: 'marior'
};


describe('POST /api/v2/users', () => {

    //mock function della ricerca di un professore per username nel database 
    //mock function della ricerca di un professore per email nel database
    let userSpy;

    beforeAll(() => {
        const User = require('../db_connection/models/user');

        //timer per jest
        jest.setTimeout(8000); 

        userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
            return {
                id: 1212,
                email: 'John@mail.com'
            };
        });
    });

    afterAll(async () => {
        userSpy.mockRestore();
    });


    //username non specificato
    test('POST /api/v2/users senza indicare uno username deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nousername)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Scegli uno username");
    });

    //username non alfanumerico 
    test('POST /api/v2/users indicando uno username non alfanumerico deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrong_username)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Username non valido, deve essere una stringa alfanumerica");
    });

    //email non specificata
    test('POST /api/v2/users senza indicare un indirizzo email deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noemail)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Inserisci un indirizzo email per continuare");
    });

});