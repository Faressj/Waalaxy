import { useState } from "react";
import { FormProps } from "../Types/types";
import "../styles/Form.scss";

const Form: React.FC<FormProps> = ({ actions, isDisabled, setActions }) => {
  const [name, setName] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const actionExist = (name: string) => {
    const test = actions.some(
      (action) => action.name.toLowerCase() == name.toLowerCase()
    );
    return test;
  };

  const handleAddAction = (newAction: any) => {
    if (actionExist(newAction.name)) {
      alert("Une Action avec ce nom existe déjà, chooisissez en un autre");
      return;
    }

    fetch("http://localhost:3001/add-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAction),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Échec de l'ajout de l'action");
        }
        return response.text();
      })
      .then(() => {
        console.log("Nouvelle action ajoutée avec succès");
        // window.location.reload();
        setActions([...actions, newAction]);
      })
      .catch((error) => console.error("Erreur lors de l'ajout: ", error));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isDisabled) {
      handleAddAction({ name, maxValue: Number(maxValue) });
    } else {
      alert("Veuillez Réinitialiser pour créer une Action");
    }
  };
  return (
    <form onSubmit={handleSubmit} id="formcreate">
      <div>Ajouter une Action</div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
      />
      <input
        type="number"
        value={maxValue}
        onChange={(e) => setMaxValue(e.target.value)}
        placeholder="Valeur Maximale"
      />
      <button type="submit" className="button-86" role="button">
        Ajouter
      </button>
    </form>
  );
};
export default Form;
