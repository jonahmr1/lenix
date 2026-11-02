import { formaterPrix as afficher } from "./prix";
import { appliquerRemise } from "./remise";
import ttc, { TVA } from "./ttc";

const calculatedTTC = TVA * 100

console.log({
	ttc: calculatedTTC,
	prix: afficher(appliquerRemise(calculatedTTC, 10))
})