const request = require('supertest');
const app = require('./app');
const User = require('../db_connection/models/user');
const { response } = require('./app');

/**
 * Testing:
 * - no words (all professor) x
 * - one word (name, surname or username) nonvalid (not alphanumeric) x
 * - valid word (name, surname or username) present on system  x
 * - valid word (name, surname or username) not present on system x
 * - non valid name and surname (not alphanumeric) x
 * - valid name and surname not present on system x
 * - valid name and surname present on system x
 */

const no_words = "";
const one_word_nonvalid = "<@?";
const one_word_valid_notpresent = "noname";
const one_word_valid_present = "mariorossi";
const name_surname_invalid = "@@@/<<<";
const name_surname_valid_notpresent = "Mario/nosurname";
const name_surname_valid_present = "Mario/Rossi";



describe('GET /api/v2/ricerca/', () => {

    const marioUserJSON = JSON.stringify({
        username: 'mariorossi',
        nome: 'Mario',
        cognome: 'Rossi',
        professore: true,
        image: '',
        materie: ['Algebra', 'Biologoia'],
        argomenti: ['Analisi 1', 'Python'],
        prezzo: 10,
        lezioni: [],
        _id: "629e2852591974b511f45985"
    });

    const allUsers = JSON.stringify([{
        username: 'prfprf',
        nome: 'prf',
        cognome: 'prf',
        professore: true,
        image: '',
        materie: ['Informatica', 'Storia'],
        argomenti: ['Programmazione', 'Rivoluzione francese'],
        prezzo: 20,
        lezioni: [],
        _id: "629e2852591974b511f45984"
    },
    {
        username: 'mariorossi',
        nome: 'Mario',
        cognome: 'Rossi',
        professore: true,
        image: '',
        materie: ['Algebra', 'Biologoia'],
        argomenti: ['Analisi 1', 'Python'],
        prezzo: 10,
        lezioni: [],
        _id: "629e2852591974b511f45985"
    }
    ]);

    const emptyList = JSON.stringify([]);

    // Moking User.findOne method
    let userSpy;

    beforeAll(() => {

        jest.setTimeout(8000);

        userSpy = jest.spyOn(User, 'find').mockImplementation((toSearch) => {
            if (toSearch.$or == null && toSearch.professore == true) {
                return [new User({
                    username: 'prfprf',
                    nome: 'prf',
                    cognome: 'prf',
                    professore: true,
                    image: '',
                    materie: ['Informatica', 'Storia'],
                    argomenti: ['Programmazione', 'Rivoluzione francese'],
                    prezzo: 20,
                    lezioni: [],
                    _id: "629e2852591974b511f45984"
                }),
                new User({
                    username: 'mariorossi',
                    nome: 'Mario',
                    cognome: 'Rossi',
                    professore: true,
                    image: '',
                    materie: ['Algebra', 'Biologoia'],
                    argomenti: ['Analisi 1', 'Python'],
                    prezzo: 10,
                    lezioni: [],
                    _id: "629e2852591974b511f45985"
                })];
            }
            else if (toSearch.$or != null && (toSearch.$or[0].username == "/mariorossi/i") || (toSearch.$or[0].nome == "/Mario/i" && toSearch.$or[0].cognome == "/Rossi/i")) {
                return new User({
                    username: 'mariorossi',
                    nome: 'Mario',
                    cognome: 'Rossi',
                    professore: true,
                    image: '',
                    materie: ['Algebra', 'Biologoia'],
                    argomenti: ['Analisi 1', 'Python'],
                    prezzo: 10,
                    lezioni: [],
                    _id: "629e2852591974b511f45985"
                });
            } else {
                return [];
            }
        });
    });

    afterAll(async () => {
        userSpy.mockRestore();
    });


    test('GET /api/v2/ricerca/ senza parole deve ritornare 200', async () => {
        const response = await request(app).get('/api/v2/ricerca/' + no_words);
        expect(response.statusCode).toBe(200);
        expect(JSON.stringify(response.body)).toBe(allUsers);
    });

    test('GET /api/v2/ricerca/ con una parola non alfanumerica deve ritornare 400', async () => {
        const response = await request(app).get('/api/v2/ricerca/' + one_word_nonvalid);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Il parametro da cercare deve essere alfanumerico");
    });
    //ERRORE
    test('GET /api/v2/ricerca/ con una parola (username, nome o cognome) valida e presente nel sistema deve ritornare 200', async () => {
        const response = await request(app).get('/api/v2/ricerca/' + one_word_valid_present);
        expect(response.statusCode).toBe(200);
        expect(JSON.stringify(response.body)).toBe(marioUserJSON);
    });

    //ERRORE
    test('GET /api/v2/ricerca/ con una parola (username, nome o cognome) valida non presente nel sistema deve ritornare 200', async () => {
        const response = await request(app).get('/api/v2/ricerca/' + one_word_valid_notpresent);
        expect(response.statusCode).toBe(200);
        expect(JSON.stringify(response.body)).toBe(emptyList);
    });


    test('GET /api/v2/ricerca/ con nome e/o cognome non alfanumerici deve ritornare 400 ', async () => {
        const response = await request(app).get('/api/v2/ricerca/' + name_surname_invalid);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Il parametro da cercare deve contenere solo lettere");
    });


    test('GET /api/v2/ricerca/ con nome e/o cognome alfanumerici e non presenti nel sistema deve ritornare 200 ', async () => {
        const response = await request(app).get('/api/v2/ricerca/' + name_surname_valid_notpresent);
        expect(response.statusCode).toBe(200);
        expect(JSON.stringify(response.body)).toBe(emptyList);
    });

    test('GET /api/v2/ricerca/ con nome e/o cognome alfanumerici e presenti nel sistema deve ritornare 200 ', async () => {
        const response = await request(app).get('/api/v2/ricerca/' + name_surname_valid_present);
        expect(response.statusCode).toBe(200);
        expect(JSON.stringify(response.body)).toBe(marioUserJSON);
    });

});