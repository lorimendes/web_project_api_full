const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Card = require('../models/card');

const request = supertest(app);

const fakeUser = {
  name: 'Card Test',
  email: 'card@test.com',
  password: 'paswordtest',
  about: 'About card',
  avatar: 'https://site.com/photo.jpg',
};

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Verifica as rotas /cards', () => {
  let token;
  let userId;
  let cardId;

  beforeAll(async () => {
    const signupResponse = await request.post('/signup').send(fakeUser);
    userId = signupResponse.body._id;

    const { email, password } = fakeUser;
    const loginResponse = await request
      .post('/signin')
      .send({ email, password });
    token = loginResponse.body.token;

    const postCardResponse = await request
      .post('/cards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Card test to delete',
        link: 'https://site.com/cardphoto.jpg',
      });
    cardId = postCardResponse.body._id;
  });

  afterAll(async () => {
    await Card.deleteMany({ owner: userId });
    await User.deleteOne({ email: fakeUser.email });
  });

  describe('Verifica solicitação POST /cards', () => {
    it('deve retornar status 201 e os cards', async () => {
      const response = await request
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Card Test', link: 'https://site.com/cardphoto.jpg' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Card Test');
    });

    it('deve retornar status 400 se os dados forem inválidos', async () => {
      const response = await request
        .post('/cards')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '', link: 'cardphoto' });

      expect(response.status).toBe(400);
    });
  });

  describe('Verifica solicitação GET /cards', () => {
    it('deve retornar status 200 e os cards', async () => {
      const response = await request
        .get('/cards')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('deve retornar status 401 se estiver sem token', async () => {
      const response = await request.get('/cards');

      expect(response.status).toBe(401);
    });
  });

  describe('Verifica solicitação PUT /cards/:cardId/likes', () => {
    it('deve retornar status 200 e os dados do card atualizado', async () => {
      const response = await request
        .put(`/cards/${cardId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.likes)).toBeTruthy();
      expect(response.body.likes).toContain(userId);
    });

    it('deve retornar status 404 se o card não for encontrado', async () => {
      const response = await request
        .put('/cards/6a923cdd16df5fa7c3219058')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Verifica solicitação DELETE /cards/:cardId/likes', () => {
    it('deve retornar status 200 e os dados do card atualizado', async () => {
      const response = await request
        .delete(`/cards/${cardId}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.likes)).toBeTruthy();
      expect(response.body.likes).not.toContain(userId);
    });

    it('deve retornar status 404 se o card não for encontrado', async () => {
      const response = await request
        .delete('/cards/6a923cdd16df5fa7c3219058')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Verifica solicitação DELETE /cards/:cardId', () => {
    let hackerToken;

    beforeAll(async () => {
      await request.post('/signup').send({
        email: 'hacker@test.com',
        password: 'paswordtest',
      });

      const loginResponse = await request.post('/signin').send({
        email: 'hacker@test.com',
        password: 'paswordtest',
      });
      hackerToken = loginResponse.body.token;
    });

    afterAll(async () => {
      await User.deleteOne({ email: 'hacker@test.com' });
    });

    it('deve retornar status 403 se o usuário não for o criador do card', async () => {
      const response = await request
        .delete(`/cards/${cardId}`)
        .set('Authorization', `Bearer ${hackerToken}`);

      expect(response.status).toBe(403);
    });

    it('deve retornar status 200 e os dados do card deletado', async () => {
      const response = await request
        .delete(`/cards/${cardId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', cardId);
    });
  });
});
