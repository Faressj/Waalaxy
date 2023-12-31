import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import Action from './models/action';

const app = express();
const port = 3001;
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
const backendtime = 90000

app.get('/actions', (req, res) => { // Récup toutes les actions dans le fichier
    fs.readFile(path.join(__dirname, "..", 'actions.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier actions.json');
            return;
        }

        try {
            const actions = JSON.parse(data);
            res.status(200).json(actions);
        } catch (parseError) {
            res.status(500).send('Erreur lors de l’analyse du fichier actions.json');
        }
    });
});

app.post('/update-action', (req, res) => { // Mets à jour les Actions pour décrementer
    const updatedAction = req.body as Action;
    console.log(updatedAction);
    
    fs.readFile(path.join(__dirname, "..", 'actions.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier actions.json');
            return;
        }

        try {
            let actions: Action[] = JSON.parse(data);
            const actionIndex = actions.findIndex(action => action.nom === updatedAction.nom);

            if (actionIndex !== -1) {
                actions[actionIndex] = updatedAction;
                fs.writeFile(path.join(__dirname, "..", 'actions.json'), JSON.stringify(actions, null, 2), 'utf8', writeErr => { // Réécris actions.json
                    if (writeErr) {
                        res.status(500).send('Erreur lors de l’écriture dans le fichier actions.json');
                        return;
                    }
                    res.status(200).send('Action mise à jour avec succès');
                });
            } else {
                res.status(404).send('Action non trouvée');
            }
        } catch (parseError) {
            res.status(500).send('Erreur lors de l’analyse du fichier actions.json');
        }
    });
});

export let updateInterval: NodeJS.Timeout;

app.post('/init-update', (req, res) => { // Recalcul apres les 15 minutes
    clearInterval(updateInterval);
    updateExecutionValues(); // Appel immédiat pour réinitialiser les valeurs
    updateInterval = setInterval(updateExecutionValues, backendtime); // Réinitialiser l'intervalle
    res.status(200).send('Intervalle de mise à jour réinitialisé');
});


function updateExecutionValues() { // Pour le recalcul, nouveaux credits des actions
    fs.readFile(path.join(__dirname, '../', 'actions.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier actions.json');
            return;
        }

        try {
            let actions: Action[] = JSON.parse(data);

            actions = actions.map(action => ({
                ...action,
                executionValue: Math.floor(action.maxValue * (0.8 + Math.random() * 0.2))
            }));

            fs.writeFile(path.join(__dirname, '../', 'actions.json'), JSON.stringify(actions, null, 2), 'utf8', writeErr => { // Réécris actions.json
                if (writeErr) {
                    console.error('Erreur lors de l’écriture dans le fichier actions.json');
                }
            });
        } catch (parseError) {
            console.error('Erreur lors de l’analyse du fichier actions.json');
        }
    });
}

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
export default server;