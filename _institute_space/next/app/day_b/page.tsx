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

const extra = livres.find(book => book.id === 3)

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
		</div>
	)
}