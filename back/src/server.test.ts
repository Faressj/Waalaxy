import supertest from 'supertest';
import app from './server';
import server, { updateInterval } from './server';

describe('Test du backend', () => {
  it('GET /actions doit renvoyer la liste des actions', async () => {
    const response = await supertest(app).get('/actions');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('POST /update-action doit mettre à jour une action', async () => {
    const actionToUpdate = { nom: 'A', maxValue: 100, executionValue: 50 };
    const response = await supertest(app).post('/update-action').send(actionToUpdate);
    expect(response.statusCode).toBe(200);
  });

  it('POST /init-update doit réinitialiser l’intervalle de mise à jour', async () => {
    const response = await supertest(app).post('/init-update');
    expect(response.statusCode).toBe(200);
  });
});

afterAll((done) => {
  clearInterval(updateInterval);
  server.close(done);

});
