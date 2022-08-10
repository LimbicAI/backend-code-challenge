import app from '../src/app';
import request from 'supertest';
import { expect } from 'chai';
import { CreateUserDto } from '../src/services/user/user.dto';
import { LoginDto } from '../src/services/login/login.dto';
import { redisClient } from '../src/connect';
import mongoose from 'mongoose';

const signUpPayload: Partial<CreateUserDto> = {
    "email": `jno4het${Date.now()}n@gmail.com`,
    "password": "@JohnDoe_1",
    "username": `johnDoe${Date.now()}`,
    "lastname": "Doe",
    "firstname": "John"
}

const loginPayload: Partial<LoginDto> = {
    "email": `jno4het${Date.now()}n@gmail.com`,
    "password": "@JohnDoe_1",
}
const loginUser = async (users_email: string, users_password: string) => {
    return request(app).post('/api/v1/login').send({ email: users_email, password: users_password });
}


const signUpUser = async (email:string = `dyz${Date.now()}@gml.com`) => {
    const { ...payload } = signUpPayload;
    payload.email = email;
    payload.username = `ne${Date.now()}User`

    return request(app).post('/api/v1/signup').send(payload);
}



describe('SERVICES', () => {

    describe('#SIGNUP', () => {
        it('POST /signup should return status code 400 if username is not passed for signup', async () => {
            const { username, ...payload } = signUpPayload
            const response = await request(app).post('/api/v1/signup').send(payload);
            const responseBody = response.body
            expect(response.status).to.equal(400);
            expect(responseBody).to.property('message', 'validation error');
            expect(responseBody.success).to.equal(false);

        });

        it('POST /signup should return status code 400 if password is not strong', async () => {
            let { ...payload } = signUpPayload
            payload.password = `oba`

            const response = await request(app).post('/api/v1/signup').send(payload);
            const responseBody = response.body
            expect(response.status).to.equal(400);
            expect(responseBody).to.have.property('message', 'validation error');
            expect(responseBody.data[0]).to.have.property('msg', 'Password must be 8 or more characters long, and must contain one or more uppercase, lowercase,number and special character ')

        });

        it('POST /signup should return status code 201', async () => {
            const response = await request(app).post('/api/v1/signup').send(signUpPayload);
            const responseBody = response.body
            expect(response.status).to.equal(201);
            expect(responseBody).to.have.property('success', true);
            expect(responseBody).to.have.property('message', 'sign up successful');
            expect(responseBody).to.have.property("data");
            expect(responseBody.data).to.have.property("email", `${signUpPayload.email}`);

        });
    });


    describe('#LOGIN', () => {
        it('POST /login should return status code 400 if email is not passed for login', async () => {
            const { email, ...payload } = loginPayload
            const response = await request(app).post('/api/v1/login').send(payload);
            const responseBody = response.body
            expect(response.status).to.equal(400);
            expect(responseBody).to.have.property('message', 'validation error');
            expect(responseBody.data[0]).to.have.property('msg', 'email is required');

        });

        it('POST /login should return status code 404 if email does not exists', async () => {
            const { ...payload } = loginPayload
            payload.email = 'IdontKnowThisEmail@xy.com'
            const response = await request(app).post('/api/v1/login').send(payload);
            const responseBody = response.body
            expect(response.status).to.equal(404);
            expect(responseBody).to.have.property('message', 'Email does not exist 🥶');

        });

        it('POST /login should return status code 201 ', async () => {
            const response = await request(app).post('/api/v1/login').send({ email: signUpPayload.email, password: signUpPayload.password });
            const responseBody = response.body
            expect(response.status).to.equal(200);
            expect(responseBody).to.have.property('message', 'Login successful');
            expect(responseBody.data).to.have.property('access_token');

        });

        it('POST /login should return status code 429 after 3 failed login attempts', async () => {
            await redisClient.incrBy(`FailedLogin-${signUpPayload.email}`, 5);
            const response = await request(app).post('/api/v1/login').send({ email: signUpPayload.email, password: signUpPayload.password });
            const responseBody = response.body
            expect(response.status).to.equal(429);
            expect(responseBody).to.have.property('message', 'Too many failed attempts, try again in a minute');
            await redisClient.decrBy(`FailedLogin-${signUpPayload.email}`, 5)
        });


    })


    describe('#UPDATE USERS PROFILE', () => {

        it('PUT /user should return status code 403  if Auth header is not passed', async () => {
            const response = await request(app).put('/api/v1/user').send();
            const responseBody = response.body
            expect(response.status).to.equal(403);
            expect(responseBody).to.have.property('message', 'Unauthorized: Auth Header is required');
        });


        it('PUT /user should return status code 401  if invalid auth header is passed', async () => {
            const response = await request(app).put('/api/v1/user').set('Authorization', `Bearer 123wde}`).send();
            const responseBody = response.body
            expect(response.status).to.equal(401);
            expect(responseBody).to.have.property('message', 'Invalid token');
        });

        it('PUT /user should return status code 400  if no payload is passed', async () => {
            const newSignUp = await signUpUser();
            const login = await loginUser(`${newSignUp.body.data.email}`, `${signUpPayload.password}`)
            const response = await request(app).put('/api/v1/user').set('Authorization', `Bearer ${login.body.data.access_token}`).send();
            const responseBody = response.body
            expect(response.status).to.equal(400);
            expect(responseBody).to.have.property('message', 'No payload passed for update');
        });

        it('PUT /user should return status code 409  if username passed is not available', async () => {
            const newSignUp = await signUpUser();
            const login = await loginUser(`${newSignUp.body.data.email}`, `${signUpPayload.password}`);

            const response = await request(app)
                .put('/api/v1/user')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
                .send({
                    username: signUpPayload.username
                });
            const responseBody = response.body
            expect(response.status).to.equal(409);
            expect(responseBody).to.have.property('message', 'Username is not available');
        });


        it('PUT /user should return status code 200  and successfully update username, firstname and lastname', async () => {
            const login = await loginUser(`${signUpPayload.email}`, `${signUpPayload.password}`);
            const payload = {
                username: `itsAnewName${Date.now()}`,
                firstname: `newFirstname${Date.now()}`,
                lastname: `newlastname${Date.now()}`,
            }
            const response = await request(app)
                .put('/api/v1/user')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
                .send(payload);
            const responseBody = response.body
            expect(response.status).to.equal(200);
            expect(responseBody).to.have.property('message', 'User profile update succesful');
            expect(responseBody.data).to.have.property('firstname', payload.firstname);
            expect(responseBody.data).to.have.property('lastname', payload.lastname);
            expect(responseBody.data).to.have.property('username', payload.username);
        });




    })


    describe('#POSTS', () => {

        it('POST /post should return status code 201 and create a new post', async () => {
            const payload = {
                title: 'Just a post',
                content: 'just some random stuff'
            }
            const login = await loginUser(`${signUpPayload.email}`, `${signUpPayload.password}`);
            const response = await request(app)
                .post('/api/v1/post')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
                .send(payload);

            const responseBody = response.body
            expect(response.status).to.equal(201);
            expect(responseBody).to.have.property('message', 'Post succesfully created 🥳 🥳');
            expect(responseBody.data).to.have.property('title', payload.title);
            expect(responseBody.data).to.have.property('content', payload.content);
        });


        it('GET /posts should return status code 200  and return all posts for the user', async () => {
            const login = await loginUser(`${signUpPayload.email}`, `${signUpPayload.password}`);
            const response = await request(app)
                .get('/api/v1/posts')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
            const responseBody = response.body
            expect(response.status).to.equal(200);
            expect(responseBody).to.have.property('message', 'Posts succesfully fetched for user 🥳 🥳');
            expect(responseBody.data).to.have.property('author');
            expect(responseBody.data).to.have.property('posts');

        });





    })




    describe('#RESET PASSWORD', () => {

        it('PUT /reset-password should return status code 401 when new_password and verify_password are not equal', async () => {

            const login = await loginUser(`${signUpPayload.email}`, `${signUpPayload.password}`);
            const payload = {
                email: signUpPayload.email,
                old_password: `${signUpPayload.password}`,
                new_password: '@Anot1h_er',
                verify_password: 'loremIpsum',
            }
            const response = await request(app)
                .put('/api/v1/reset-password')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
                .send(payload);

            const responseBody = response.body
            expect(response.status).to.equal(400);
            expect(responseBody).to.have.property('message', 'validation error');
            expect(responseBody.data[0]).to.have.property('msg', 'verify_password must be equal to new_password');

        });

        it('PUT /reset-password should return status code 401 when old_password on the payload is not equal to the db password', async () => {

            const login = await loginUser(`${signUpPayload.email}`, `${signUpPayload.password}`);
            const payload = {
                email: signUpPayload.email,
                old_password: `@SeemsNotToRemember_1`,
                new_password: '@Anot1h_er',
                verify_password: '@Anot1h_er',
            }
            const response = await request(app)
                .put('/api/v1/reset-password')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
                .send(payload);

            const responseBody = response.body

            expect(response.status).to.equal(401);
            expect(responseBody).to.have.property('message', 'Ensure you enter the correct old_password');


        });

        it('PUT /reset-password should return status code 403 if email passed on payload does not correspond to email the token is sign with', async () => {
            const signup_1 = await signUpUser();
            const login = await loginUser(`${signup_1.body.data.email}`, `${signUpPayload.password}`);
            const payload = {
                email: `${signUpPayload.email}`,
                old_password: `${signUpPayload.password}`,
                new_password: '@Anot1h_er',
                verify_password: '@Anot1h_er',
            }
            const response = await request(app)
                .put('/api/v1/reset-password')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
                .send(payload);
            const responseBody = response.body
            expect(response.status).to.equal(403);
            expect(responseBody).to.have.property('message', 'ACCESS DENIED!');


        });

        it('PUT /reset-password should return status code 200 and successfully reset password', async () => {

            const login = await loginUser(`${signUpPayload.email}`, `${signUpPayload.password}`);
            const payload = {
                email: `${signUpPayload.email}`,
                old_password: `${signUpPayload.password}`,
                new_password: '@Anot1h_er',
                verify_password: '@Anot1h_er',
            }
            const response = await request(app)
                .put('/api/v1/reset-password')
                .set('Authorization', `Bearer ${login.body.data.access_token}`)
                .send(payload);
            const responseBody = response.body

            expect(response.status).to.equal(200);
            expect(responseBody).to.have.property('message', 'Password reset successful');
            signUpPayload.password = payload.new_password;
            signUpPayload.email = payload.email;
            // Login with the new password
            const loginAfterPasswordReset = await loginUser(`${payload.email}`, `${payload.new_password}`);
            expect(loginAfterPasswordReset.body).to.have.property('message', 'Login successful');
            expect(loginAfterPasswordReset.body.data).to.have.property('access_token');
        });


    })
});

afterAll(() => mongoose.disconnect());
afterAll(() => redisClient.quit());
