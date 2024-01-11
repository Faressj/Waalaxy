import supertest from 'supertest';
import app from './server';
import server from './server';
import fs from 'fs';
import path from 'path';

const actionsFilePath = path.join(__dirname, '..', 'actions.json');
let originalActions:any;

const readActionsFile = () => {
  return JSON.parse(fs.readFileSync(actionsFilePath, 'utf8'));
};

const writeActionsFile = (data:any) => {
  fs.writeFileSync(actionsFilePath, JSON.stringify(data, null, 2), 'utf8');
};

describe('Test du backend', () => {
  beforeAll(() => {
    originalActions = readActionsFile();
  });

  afterAll((done) => {
    writeActionsFile(originalActions);
    server.close(done);
  });

  it('GET /actions doit renvoyer la liste des actions', async () => {
    originalActions = readActionsFile();
    const response = await supertest(app).get('/actions');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toEqual(originalActions);
  });

  it('POST /add-action doit ajouter une nouvelle action', async () => {
    const newAction = { name: 'New Action', maxValue: 100, executionValue: 50 };
    const response = await supertest(app).post('/add-action').send(newAction);
    expect(response.statusCode).toBe(200);

    const updatedActions = readActionsFile();
    expect(updatedActions).toContainEqual(newAction);
  });

  it('POST /update-action doit mettre à jour une action', async () => {
    const actionToUpdate = { name: 'A', maxValue: 150, executionValue: 140 };
    const response = await supertest(app).post('/update-action').send(actionToUpdate);
    expect(response.statusCode).toBe(200);

    const updatedActions = readActionsFile();
    expect(updatedActions).toContainEqual(actionToUpdate);
  });

  it('POST /init-update doit réinitialiser l’intervalle de mise à jour', async () => {
    const response = await supertest(app).post('/init-update');
    expect(response.statusCode).toBe(200);
  });
});
