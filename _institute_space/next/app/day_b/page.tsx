const films = [
  { titre: 'Le Roi Lion', genre: 'animation', duree: 118 },
  { titre: 'Alien', genre: 'science-fiction', duree: 117 },
  { titre: 'Wall-E', genre: 'animation', duree: 98 },
  { titre: 'Gladiator', genre: 'action', duree: 155 },
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

export default () => {
	return (
		<div>
			{films.map((film, i) => <Film key={i} title={film.titre} gender={film.genre} duration={film.duree} />)}
		</div>
	)
}