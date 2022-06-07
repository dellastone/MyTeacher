const app = require('../app/app');
const supertest = require('supertest');
const request = supertest(app);

const username = 'mariorossi1';

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
const username_already_used = {
    username: 'mariorossi',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: true
};
const email_already_used = {
    username: 'mariorossi1',
    email: 'mariorossi@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: true
};
const passwords_not_corresponding = {
    username: 'mariorossi1',
    email: 'mariorossi1@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1vebefb?',
    professore: true
};
const not_phone_number = {
    username: 'mariorossi1',
    email: 'mariorossi1@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: true,
    phone: '123abc'
};
const not_a_price = {
    username: 'mariorossi1',
    email: 'mariorossi1@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: true,
    phone: '3443552354',
    prezzo: 'abc'
};
const mandatory_data = {
    username: 'mariorossi1',
    email: 'mariorossi1@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: true
};
const mandatory_data_student = {
    username: 'mariorossi1',
    email: 'mariorossi1@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: false
};
const all_data = {
    username: 'mariorossi1',
    email: 'mariorossi1@gmail.com',
    nome: 'Mario',
    cognome: 'Rossi',
    password: 'Cjndc1fvebefb?',
    repeatpassword: 'Cjndc1fvebefb?',
    professore: true,
    phone: '3224776548',
    image: 'hsjdbviwejnwoevnwoeufbwouefn',
    materie: [
        'matematica',
        'inglese'
    ],
    argomenti: [
        'integrali',
        'past simple'
    ],
    prezzo: 10
};



describe('POST /api/v2/users', () => {

    //mock function della ricerca di un professore per username nel database 
    //mock function della ricerca di un professore per email nel database
    let userSpyFound;
    let createUser, createConto;

    beforeAll(() => {
        const User = require('../db_connection/models/user');
        const Conto = require('../db_connection/models/conto');
        //timer per jest
        jest.setTimeout(8000);

        userSpyFound = jest.spyOn(User, 'findOne').mockImplementation((toSearch) => {
            if (toSearch.username == 'mariorossi' || toSearch.email == 'mariorossi@gmail.com') {
                return {
                    _id: "efbg847grywg3r3y8g4",
                    username: 'mariorossi',
                    email: 'mariorossi@gmail.com',
                    nome: 'Mario',
                    cognome: 'Rossi',
                    salt: '8b23c5aa5a5aaca5fa32e4d9e03347de',
                    passwordHash: 'f2b4674259f2340b1614f9dd858d3cb490b821038a608f8ea1cef675912a47ca69ef65fbb1fa6d7fe76aa92cf21be207625ad5e0a47fcfb807ec8f639c696673',
                    professore: true
                };
            }
            else {
                return null;
            }
        });

        createUser = jest.spyOn(User.prototype, 'save').mockImplementation();
        createConto = jest.spyOn(Conto.prototype, 'save').mockImplementation();
    });

    afterAll(async () => {
        userSpyFound.mockRestore();
        createConto.mockRestore();
        createUser.mockRestore();
    });


    //username non specificato
    test('POST /api/v2/users senza indicare uno username deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(nousername))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Scegli uno username");
    });

    //username non alfanumerico 
    test('POST /api/v2/users indicando uno username non alfanumerico deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(wrong_username))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Username non valido, deve essere una stringa alfanumerica");
    });

    //email non specificata
    test('POST /api/v2/users senza indicare un indirizzo email deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(noemail))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Inserisci un indirizzo email per continuare");
    });

    //email non valida
    test('POST /api/v2/users indicando un indirizzo email non valido deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(wrong_email))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("L'email inserita non è valida");
    });

    //nome non presente
    test('POST /api/v2/users senza indicare un nome deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(noname))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Inserisci il tuo nome prima di continuare");
    });

    //nome non valido
    test('POST /api/v2/users indicando un nome non valido deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(wrong_name))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Nome non valido");
    });

    //cognome non presente
    test('POST /api/v2/users senza indicare un cognome deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(nosurname))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Inserisci il tuo cognome prima di continuare");
    });

    //cognome non valido
    test('POST /api/v2/users indicando un cognome non valido deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(wrong_surname))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Cognome non valido");
    });

    //password non specificata
    test('POST /api/v2/users senza indicare il campo password deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(nopassword))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Inserisci una password prima di continuare");
    });

    //password non sicura
    /*
    se non contiene almeno 8 caratteri
    se non contiene almeno una lettera maiuscola e una minuscola
    se non contiene almeno un numero e un carattere speciale
    */
    test('POST /api/v2/users inserendo una password non sicura deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(insecure_password))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("La password inserita non è sicura, deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale");
    });

    //campo ripeti password non specificato
    test('POST /api/v2/users senza indicare il campo ripeti password deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(norepeat))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Completa il campo ripeti password per continuare");
    });

    //tipologia di utente non specificata
    test('POST /api/v2/users senza specificare se l\'utente deve essere di tipo professore o studente deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(nousertype))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("E' obbligatorio scegliere se creare un account professore o studente");
    });

    //registrazione con tutti e soli i dati obbligatori inseriti correttamente ma username già presente nel database
    test('POST /api/v2/users specificando tutti e soli i dati obbligatori ma uno username già presente nel database deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(username_already_used))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Username non disponibile");
    });

    //registrazione con tutti e soli i dati obbligatori inseriti correttamente ma email già presente nel database
    test('POST /api/v2/users specificando tutti e soli i dati obbligatori con indirizzo email già presente nel database deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(email_already_used))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Esiste già un utente registrato con questo indirizzo email");
    });

    //registrazione con i campi password e ripeti password che non corrispondono
    test('POST /api/v2/users con i campi password e ripeti password che non corrispondono deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(passwords_not_corresponding))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Le due password inserite non corrispondono");
    });

    //registrazione inserendo un numero di telefono non valido
    test('POST /api/v2/users inserendo un numero di telefono non valido deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(not_phone_number))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Numero di telefono non valido");
    });

    //registrazione inserendo un prezzo non numerico 
    test('POST /api/v2/users inserendo un prezzo non numerico deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(not_a_price))
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Il prezzo inserito non è valido");
    });

    //registrazione corretta di un professore con tutti e soli i dati obbligatori 
    test('POST /api/v2/users inserendo correttamente tutti i dati obbligatori deve ritornare 201 (professore)', async () => {
        expect.assertions(4);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(mandatory_data))
        expect(res.status).toBe(201);
        const json = res.body;
        expect(json.location).toEqual("/api/v2/users/" + username);
        expect(createUser).toHaveBeenCalled();
        expect(createConto).toHaveBeenCalled();
    });

    //registrazione corretta di uno studente con tutti e soli i dati obbligatori 
    test('POST /api/v2/users inserendo correttamente tutti i dati obbligatori deve ritornare 201 (studente)', async () => {
        expect.assertions(4);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(mandatory_data_student))
        expect(res.status).toBe(201);
        const json = res.body;
        expect(json.location).toEqual("/api/v2/users/" + username);
        expect(createUser).toHaveBeenCalled();
        expect(createConto).toHaveBeenCalled();
    });

    //registrazione corretta di un professore con tutti i dati 
    test('POST /api/v2/users inserendo correttamente tutti i dati deve ritornare 201', async () => {
        expect.assertions(4);
        const res = await request
            .post('/api/v2/users')
            .set('Content-type', 'application/json')
            .send(JSON.stringify(all_data))
        expect(res.status).toBe(201);
        const json = res.body;
        expect(json.location).toEqual("/api/v2/users/" + username);
        expect(createUser).toHaveBeenCalled();
        expect(createConto).toHaveBeenCalled();
    });
});


describe('GET /api/v2/users', () => {

    let userSpyArray;

    beforeAll(() => {
        const User = require('../db_connection/models/user');

        //timer per jest
        jest.setTimeout(8000);

        userSpyArray = jest.spyOn(User, 'find').mockImplementation((toSearch) => {
            return [
                {
                    username: 'luigiverdi',
                    email: 'luigiverdi@gmail.com',
                    nome: 'Luigi',
                    cognome: 'Verdi',
                    professore: true,
                    phone: '3224776548',
                    image: 'hsjdbviwejnwoevnwoeufbwouefn',
                    materie: [
                        'matematica',
                        'inglese'
                    ],
                    argomenti: [
                        'integrali',
                        'past simple'
                    ],
                    prezzo: 10
                },
                {
                    username: 'mariorossi1',
                    email: 'mariorossi1@gmail.com',
                    nome: 'Mario',
                    cognome: 'Rossi',
                    professore: false
                }
            ];
        });
    });

    afterAll(async () => {
        userSpyArray.mockRestore();
    });

    //restituzione della lista utenti 
    test('GET /api/v2/users deve ritornare 200', async () => {
        expect.assertions(2);
        const res = await request
            .get('/api/v2/users')
            .expect('Content-Type', /json/)
        expect(res.status).toBe(200);

        const json = res.body;
        expect(json).toEqual([
            {
                username: 'luigiverdi',
                email: 'luigiverdi@gmail.com',
                nome: 'Luigi',
                cognome: 'Verdi',
                professore: true,
                phone: '3224776548',
                image: 'hsjdbviwejnwoevnwoeufbwouefn',
                materie: [
                    'matematica',
                    'inglese'
                ],
                argomenti: [
                    'integrali',
                    'past simple'
                ],
                prezzo: 10
            },
            {
                username: 'mariorossi1',
                email: 'mariorossi1@gmail.com',
                nome: 'Mario',
                cognome: 'Rossi',
                professore: false
            }
        ]);
    });

});

describe('GET /api/v2/users/:username', () => {

    let userSpyArray;

    beforeAll(() => {
        const User = require('../db_connection/models/user');

        //timer per jest
        jest.setTimeout(8000);

        userSpyArray = jest.spyOn(User, 'findOne').mockImplementation((toSearch) => {
            if (toSearch.username == "luigiverdi") {
                return {
                    username: 'luigiverdi',
                    email: 'luigiverdi@gmail.com',
                    nome: 'Luigi',
                    cognome: 'Verdi',
                    professore: true,
                    phone: '3224776548',
                    image: 'hsjdbviwejnwoevnwoeufbwouefn',
                    materie: [
                        'matematica',
                        'inglese'
                    ],
                    argomenti: [
                        'integrali',
                        'past simple'
                    ],
                    prezzo: 10
                };
            }
            else {
                return null;
            }
        });
    });
    afterAll(async () => {
        userSpyArray.mockRestore();
    });

    //restituzione utente esistente
    test('GET /api/v2/users/:username se l\'utente esiste nel database deve ritornare 200', async () => {
        expect.assertions(2);
        const res = await request
            .get('/api/v2/users/luigiverdi')
            .expect('Content-Type', /json/)
        expect(res.status).toBe(200);
        const json = res.body;
        expect(json).toEqual(
            {
                username: 'luigiverdi',
                email: 'luigiverdi@gmail.com',
                nome: 'Luigi',
                cognome: 'Verdi',
                professore: true,
                phone: '3224776548',
                image: 'hsjdbviwejnwoevnwoeufbwouefn',
                materie: [
                    'matematica',
                    'inglese'
                ],
                argomenti: [
                    'integrali',
                    'past simple'
                ],
                prezzo: 10
            }
        );
    });

    //utente non esistente nel database
    test('GET /api/v2/users/:username se l\'utente non esiste nel database deve ritornare 400', async () => {
        expect.assertions(2);
        const res = await request
            .get('/api/v2/users/mariorossi')
            .expect('Content-Type', /json/)
        expect(res.status).toBe(400);
        const json = res.body;
        expect(json.message).toEqual("Utente non presente nel database");
    });
});