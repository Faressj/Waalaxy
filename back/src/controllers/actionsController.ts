import { Request, Response } from "express";
import Action from "../models/action";
import fs from "fs";
import path from "path";

export const getAllActions = async (req: Request, res: Response) => {
  fs.readFile(
    path.join(__dirname, "../", "..", "actions.json"),
    "utf8",
    (err, data) => {
      if (err) {
        res
          .status(500)
          .send("Erreur lors de la lecture du fichier actions.json");
        return;
      }

      try {
        const actions = JSON.parse(data);
        res.status(200).json(actions);
      } catch (parseError) {
        res
          .status(500)
          .send("Erreur lors de l’analyse du fichier actions.json");
      }
    }
  );
};

export const updateAction = async (req: Request, res: Response) => {
  const updatedAction = req.body as Action;

  if (!updatedAction.name || typeof updatedAction.name !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères.');
    return;
  }

  fs.readFile(
    path.join(__dirname, "../", "..", "actions.json"),
    "utf8",
    (err, data) => {
      if (err) {
        res
          .status(500)
          .send("Erreur lors de la lecture du fichier actions.json");
        return;
      }

      try {
        let actions: Action[] = JSON.parse(data);
        const actionIndex = actions.findIndex(
          (action) => action.name === updatedAction.name
        );

        if (actionIndex !== -1) {
          actions[actionIndex] = updatedAction;
          fs.writeFile(
            path.join(__dirname, "../", "..", "actions.json"),
            JSON.stringify(actions, null, 2),
            "utf8",
            (writeErr) => {
              if (writeErr) {
                res
                  .status(500)
                  .send(
                    "Erreur lors de l’écriture dans le fichier actions.json"
                  );
                return;
              }
              res.status(200).send("Action mise à jour avec succès");
            }
          );
        } else {
          res.status(404).send("Action non trouvée");
        }
      } catch (parseError) {
        res
          .status(500)
          .send("Erreur lors de l’analyse du fichier actions.json");
      }
    }
  );
};

export const initUpdate = async (req: Request, res: Response) => {
  updateExecutionValues();
  res.status(200).send("Intervalle de mise à jour réinitialisé");
};

export const addAction = async (req: Request, res: Response) => {
  const newAction = req.body;

  if (!newAction.name || typeof newAction.name !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères.');
    return;
  }

  fs.readFile(
    path.join(__dirname, "../", "..", "actions.json"),
    "utf8",
    (err, data) => {
      if (err) {
        res
          .status(500)
          .send("Erreur lors de la lecture du fichier actions.json");
        return;
      }

      try {
        let actions = JSON.parse(data);
        actions.push(newAction);

        fs.writeFile(
          path.join(__dirname, "../", "..", "actions.json"),
          JSON.stringify(actions, null, 2),
          "utf8",
          (writeErr) => {
            if (writeErr) {
              res
                .status(500)
                .send("Erreur lors de l’écriture dans le fichier actions.json");
              return;
            }
            res.status(200).send("Nouvelle action ajoutée avec succès");
          }
        );
      } catch (parseError) {
        res
          .status(500)
          .send("Erreur lors de l’analyse du fichier actions.json");
      }
    }
  );
};

function updateExecutionValues() {
  fs.readFile(
    path.join(__dirname, "../", "..", "actions.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Erreur lors de la lecture du fichier actions.json");
        return;
      }

      try {
        let actions: Action[] = JSON.parse(data);
        actions = actions.map((action) => ({
          ...action,
          executionValue: Math.floor(
            action.maxValue * (0.8 + Math.random() * 0.2)
          ),
        }));

        fs.writeFile(
          path.join(__dirname, "../", "..", "actions.json"),
          JSON.stringify(actions, null, 2),
          "utf8",
          (writeErr) => {
            if (writeErr) {
              console.error(
                "Erreur lors de l’écriture dans le fichier actions.json"
              );
            }
          }
        );
      } catch (parseError) {
        console.error("Erreur lors de l’analyse du fichier actions.json");
      }
    }
  );
}
