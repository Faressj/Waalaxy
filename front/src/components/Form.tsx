import { useState } from "react";
interface Action {
    nom: string;
    maxValue: number;

}
interface FormProps {
    actions: Action[];
    isDisabled: boolean;
}
const Form: React.FC<FormProps> = ({ actions, isDisabled }) => {

    const [nom, setNom] = useState('');
    const [maxValue, setMaxValue] = useState('')

    const actionExist = (nom: string) => {
        const test = actions.some(action => action.nom.toLowerCase() == nom.toLowerCase())
        return test;
    }

    const handleAddAction = (newAction: any) => {
        if (actionExist(newAction.nom)) {
            alert("Une Action avec ce nom existe déjà, chooisissez en un autre");
            return;
        }
        fetch('http://localhost:3001/add-action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAction),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Échec de l'ajout de l'action");
                }
                return response.text();
            })
            .then(() => {
                console.log('Nouvelle action ajoutée avec succès');
                window.location.reload()
            })
            .catch(error => console.error("Erreur lors de l'ajout: ", error));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDisabled) {
            handleAddAction({ nom, maxValue: Number(maxValue) })
        } else {
            alert("Veuillez Réinitialiser pour créer une Action")
        }
    };
    return (

        <form onSubmit={handleSubmit} id="formcreate">
            <div>Ajouter une Action</div>
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" />
            <input type="number" value={maxValue} onChange={e => setMaxValue(e.target.value)} placeholder="Valeur Maximale" />
            <button type="submit" className="button-86" role="button" disabled={isDisabled}>Ajouter</button>



        </form>

    )
}
export default Form;