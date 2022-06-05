const fetch = require("node-fetch");
const app = require('../app/app');
const supertest = require('supertest');
const request = supertest(app);

const url = process.env.HEROKU || "http://localhost:3000";

const username = 'mariorossi';

const nousername = {};
const wrong_username = {
    username: '<mariorossi>'
};
const noemail = {
    username: 'mariorossi'
};
const wrong_email = {
    username: 'mariorossi',
    email: 'notanemail.com'
};
const noname = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com'
};
const wrong_name = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: '123'
};
const nosurname = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario'
};
const wrong_surname = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: '123'
};
const nopassword = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi'
};
const insecure_password = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'notsecure'
};
const norepeat = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?'
};
const nousertype = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?'
};
const mandatory_data = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: true
};



describe('POST /api/v2/users', () => {

    //mock function della ricerca di un professore per username nel database 
    //mock function della ricerca di un professore per email nel database
    let userSpyFound;

    beforeAll(() => {
        const User = require('../db_connection/models/user');

        //timer per jest
        jest.setTimeout(8000); 

        userSpyFound = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
            return {
                id: "efbg847grywg3r3y8g4",
                username: 'mariorossiff',
                email: 'mariorossi@gmail.com',
                nome: 'Mario',
                cognome: 'Rossi',
                salt: '8b23c5aa5a5aaca5fa32e4d9e03347de',
                passwordHash: 'f2b4674259f2340b1614f9dd858d3cb490b821038a608f8ea1cef675912a47ca69ef65fbb1fa6d7fe76aa92cf21be207625ad5e0a47fcfb807ec8f639c696673',
                professore: true
            };
        });
    });

    afterAll(async () => {
        userSpyFound.mockRestore();
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

    //email non valida
    test('POST /api/v2/users indicando un indirizzo email non valido deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrong_email)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("L'email inserita non è valida");
    });

    //nome non presente
    test('POST /api/v2/users senza indicare un nome deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noname)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Inserisci il tuo nome prima di continuare");
    });

    //nome non valido
    test('POST /api/v2/users indicando un nome non valido deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrong_name)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Nome non valido");
    });

    //cognome non presente
    test('POST /api/v2/users senza indicare un cognome deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nosurname)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Inserisci il tuo cognome prima di continuare");
    });

    //cognome non valido
    test('POST /api/v2/users indicando un cognome non valido deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrong_surname)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Cognome non valido");
    });

    //password non specificata
    test('POST /api/v2/users senza indicare il campo password deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nopassword)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Inserisci una password prima di continuare");
    });

    //password non sicura
    /*
    se non contiene almeno 8 caratteri
    se non contiene almeno una lettera maiuscola e una minuscola
    se non contiene almeno un numero e un carattere speciale
    */
    test('POST /api/v2/users inserendo una password non sicura deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(insecure_password)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("La password inserita non è sicura, deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale");
    });

    //campo ripeti password non specificato
    test('POST /api/v2/users senza indicare il campo ripeti password deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(norepeat)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("Completa il campo ripeti password per continuare");
    });

    //tipologia di utente non specificata
    test('POST /api/v2/users senza specificare se l\'utente deve essere di tipo professore o studente deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nousertype)
        });
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.message).toBe("E' obbligatorio scegliere se creare un account professore o studente");
    });

    //registrazione con tutti e soli i dati obbligatori inseriti correttamente
    test('POST /api/v2/users senza specificare se l\'utente deve essere di tipo professore o studente deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await fetch(url + '/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mandatory_data)
        });
        expect(res.status).toBe(400);
        expect(userSpyFound).toHaveBeenCalledTimes(1);
        const json = await res.json();
        expect(json.message).toBe("/api/v2/users/" + username);
    });
});