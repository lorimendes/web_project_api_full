const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const request = supertest(app);

const fakeUser = {
  name: 'User Test',
  email: 'user@test.com',
  password: 'paswordtest',
  about: 'About user',
  avatar: 'https://site.com/photo.jpg',
};

const invalidUser = {
  name: 'u',
  email: 'user@',
  about: 'a',
  avatar: 'site',
  password: '123',
};

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Verifica solicitação POST /signup', () => {
  it('deve retornar status 201 e os dados do usuário', async () => {
    const response = await request.post('/signup').send(fakeUser);

    expect(response.status).toBe(201);
    expect(response.header['content-type']).toMatch('application/json');
    expect(response.body).toHaveProperty('_id');
  });

  it('deve retornar status 409 ao enviar mesmo e-mail pela segunda vez', async () => {
    const response = await request.post('/signup').send(fakeUser);

    expect(response.status).toBe(409);
  });

  it('deve retornar status 400 ao enviar dados inválidos', async () => {
    const { email, password } = invalidUser;

    const response = await request.post('/signup').send({ email, password });

    expect(response.status).toBe(400);
  });

  afterAll(async () => {
    await User.deleteOne({ email: fakeUser.email });
  });
});

describe('Verifica solicitação POST /signin', () => {
  beforeAll(async () => {
    await request.post('/signup').send(fakeUser);
  });

  it('deve retornar status 200 e o token', async () => {
    const { email, password } = fakeUser;
    const response = await request.post('/signin').send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('deve retornar status 401 ao enviar dados incorretos', async () => {
    const response = await request
      .post('/signin')
      .send({ email: 'user@err.com', password: '123213123' });

    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await User.deleteOne({ email: fakeUser.email });
  });
});

describe('Verifica as rotas /users', () => {
  let token;

  beforeAll(async () => {
    await request.post('/signup').send(fakeUser);
    const { email, password } = fakeUser;
    const loginResponse = await request
      .post('/signin')
      .send({ email, password });
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteOne({ email: fakeUser.email });
  });

  describe('Verifica solicitação GET /users/me', () => {
    it('deve retornar status 200 e os dados de usuário', async () => {
      const response = await request
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
    });

    it('deve retornar status 401 se estiver sem token', async () => {
      const response = await request.get('/users/me');

      expect(response.status).toBe(401);
    });
  });

  describe('Verifica solicitação PATCH users/me', () => {
    it('deve retornar status 200 e os dados atualizados do usuário', async () => {
      const response = await request
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name', about: 'New about' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'New Name');
    });

    it('deve retornar status 400 se os dados forem inválidos', async () => {
      const response = await request
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '', about: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('Verifica solicitação PATCH users/me/avatar', () => {
    it('deve retornar status 200 e os dados atualizados do usuário', async () => {
      const response = await request
        .patch('/users/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ avatar: 'https://site.com/newphoto.jpg' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'avatar',
        'https://site.com/newphoto.jpg',
      );
    });

    it('deve retornar status 400 se os dados forem inválidos', async () => {
      const response = await request
        .patch('/users/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .send({ avatar: 'newphoto' });

      expect(response.status).toBe(400);
    });
  });
});
