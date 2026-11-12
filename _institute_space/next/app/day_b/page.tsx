const films = [
  { titre: 'Le Roi Lion', genre: 'animation', duree: 118 },
  { titre: 'Alien', genre: 'science-fiction', duree: 117 },
  { titre: 'Wall-E', genre: 'animation', duree: 98 },
  { titre: 'Gladiator', genre: 'action', duree: 155 },
];

const livres = [
  { id: 1, titre: "Le Petit Prince", auteur: "Saint-Exupéry", disponible: true },
  { id: 2, titre: "La Peste", auteur: "Camus", disponible: false },
  { id: 3, titre: "Nedjma", auteur: "Kateb Yacine", disponible: true },
  { id: 4, titre: "La Grande Maison", auteur: "Mohammed Dib", disponible: false },
];

const contacts = [
  { id: 1, nom: "Sara", telephone: "0550 11 22 33", ville: "Alger", favori: true },
  { id: 2, nom: "Ali", telephone: "0661 44 55 66", ville: "", favori: false },
  { id: 3, nom: "Nora", telephone: "0770 77 88 99", ville: "Oran", favori: true },
  { id: 4, nom: "Karim", telephone: "0555 00 11 22", ville: "Blida", favori: false },
];
const idRecherche = 3;

const Film = ({ title, gender, duration }: {
	title: string
	gender: string
	duration: number
}) => (
	<div>
		<p>{title} : {gender} : {duration}</p>
		{duration >= 100 && <p>Long Film!</p>}
	</div>
)

const Book = ({ title, author }: {
	title: string
	author: string
}) => (
	<p>{title} : {author}</p>
)

const Contact = ({ nom, telephone, favori, ville }: {
	nom: string
	telephone: string
	favori: boolean
	ville: string
}) => {
  return (
    <p>
      {nom} : {telephone} ({ville || "Ville non renseignée"})
      {favori && " Favori"}
    </p>
  );
}

const extra = livres.find(book => book.id === 3)
const nombreFavoris = contacts.filter((contact) => contact.favori).length;
const contactRecherche = contacts.find((contact) => contact.id === idRecherche);

export default () => {
	return (
		<div>
			<h2>A</h2>
			<div>
				{films.map((film, i) => <Film key={i} title={film.titre} gender={film.genre} duration={film.duree} />)}
			</div>
			<br />
			<h2>B</h2>
			<div>
				{livres.length ? (
					<div>
						{livres.filter(book => book.disponible).map(book => (
							<Book key={book.id} title={book.titre} author={book.auteur} />
						))}
						<p>Books available: {livres.length}</p>
					</div>
				) : <p>No books available</p>}
				<h3>extra</h3>
				<p>{extra ? extra.titre : 'Unavailable'}</p>
			</div>
			<br />
			<h2>C</h2>
			<div>
				{contacts.length ? (
					<ul>
					{contacts.map((contact) => (
						<li key={contact.id}>
							<Contact {...contact} />
						</li>
					))}
					</ul>
				) : <p>Aucun contact</p>}
				<p>{nombreFavoris} favoris</p>
				<p>{contactRecherche ? contactRecherche.nom : "Introuvable"}</p>
			</div>
		</div>
	)
}