import { appliquerRemise, TVA } from "."
import { formaterPrix as afficher } from "."

const calculatedTTC = TVA * 100

console.log({
	ttc: calculatedTTC,
	prix: afficher(appliquerRemise(calculatedTTC, 10))
})