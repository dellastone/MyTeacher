const request = require('supertest');
const app = require('../app/app');
const User = require('../db_connection/models/user');

/**
 * Testing:
 * - no mail = no data
 * - wrong mail
 * - no password
 * - wrong password
 * - correct data
 */

const no_mail = { email: '', password: 'Professore00!' };

const wrong_mail = { email: 'marioprossi@gmail.com', password: 'Professore00!' };

const no_password = { email: 'mariorossi@gmail.com', password: '' };

const wrong_password = { email: 'mariorossi@gmail.com', password: 'Professore11!' };

const correct_data = { email: 'mariorossi@gmail.com', password: 'Professore00!' };


describe('POST /api/v2/users/auth', () => {
    // Moking User.findOne method
    let userSpy;

    beforeAll(() => {

        jest.setTimeout(8000);

        userSpy = jest.spyOn(User, 'findOne').mockImplementation((toSearch) => {

            if (toSearch.email == 'mariorossi@gmail.com') {
                return new User({
                    username: 'mariorossi',
                    email: 'mariorossi@gmail.com',
                    salt: '52a9274c3781749d1d9a7e4b952ff431',
                    passwordHash: '59c190144aef2fdc877a56668d840f7bbc8ada0ba99062d6f69daba5407b15e72a883fc6575efcac3583ed850c4808858ab03c4e12a8a63bc6ef3d366b10aeff',
                });
            }
            else {
                return null;
            }
        });

    });

    afterAll(async () => {
        userSpy.mockRestore();
    });

    test('POST /api/v2/users/auth senza inserire la mail deve ritornare 401.', () => {
        return request(app)
            .post('/api/v2/users/auth')
            .set('Accept', 'application/json')
            .send(no_mail) // sends a JSON post body
            .expect(401, { message: 'Errore, utente non trovato.' });

    });

    test('POST /api/v2/users/auth inserendo una mail non corretta (non appartente a nessun utente presente nel sistema) deve ritornare 401.', () => {
        return request(app)
            .post('/api/v2/users/auth')
            .set('Accept', 'application/json')
            .send(wrong_mail) // sends a JSON post body
            .expect(401, { message: 'Errore, utente non trovato.' });
    });

    test('POST /api/v2/users/auth senza inserire la password deve ritornare 401.', () => {
        return request(app)
            .post('/api/v2/users/auth')
            .set('Accept', 'application/json')
            .send(no_password) // sends a JSON post body
            .expect(401, { message: 'Errore, password errata.' });
    });

    test('POST /api/v2/users/auth inserendo una password errata deve ritornare 401.', () => {
        return request(app)
            .post('/api/v2/users/auth')
            .set('Accept', 'application/json')
            .send(wrong_password) // sends a JSON post body
            .expect(401, { message: 'Errore, password errata.' });
    });

    test('POST /api/v2/users/auth inserendo i dati correttamente (di un utente esistente nel sistema) deve ritornare 200', () => {
        return request(app)
            .post('/api/v2/users/auth')
            .set('Accept', 'application/json')
            .send(correct_data) // sends a JSON post body
            .expect(200);
    });
});