const currency = '$'
const products: {
    img: string;
    type: string;
    title: string;
    price: string;
}[] = [
	{
		img: 'https://picsum.photos/100/200',
		type: 'Beauty',
		title: 'Essence Mascara Lash Princess',
		price: '9.99',
	},
	{
		img: 'https://picsum.photos/100/200',
		type: 'Beauty',
		title: 'Essence Mascara Lash Princess',
		price: '9.99',
	},
	{
		img: 'https://picsum.photos/100/200',
		type: 'Beauty',
		title: 'Essence Mascara Lash Princess',
		price: '9.99',
	},
]

export const Boutique = () => {
	return (
		<div style={{
			backgroundColor: 'rgba(255, 255, 255, 0.5)',
			height: '100vh',
			width: '100vw',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center'
		}}>
			<div style={{
				display: 'flex',
				width: '100%',
				justifyContent: 'space-between',
				paddingInline: '100px',
				paddingBlock: '2.5%',
				backgroundColor: 'AccentColor'
			}}>
				<div>Mon Boutique</div>
				<div>Accueil</div>
			</div>
			<div style={{
				display: "flex",
				flexDirection: 'column',
				alignItems: 'start'
			}}>
				<h1 style={{
					color: 'Background'
				}}>Nos Produits</h1>
				<div style={{
					display: "flex",
					gap: '2%'
				}}>
					{products.map((product, i) => (
						<div
							key={i}
							style={{
								borderRadius: '0.5rem',
								overflow: 'hidden',
								boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.25)',
								color: 'Background'
							}}
						>
							<img src={product.img} />
							<div style={{
								paddingInline: '5%',
								paddingBlock: '5%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'start',
								backgroundColor: 'AccentColorText',
								gap: '0.5rem'
							}}>
								<p style={{
									textTransform: 'uppercase',
									fontSize: '0.8rem'
								}}>{product.type}</p>
								<p style={{
									textAlign: 'left',
									fontSize: '1.25rem',
									fontWeight: 'bold'
								}}>{product.title}</p>
								<p style={{
									color: 'AccentColor',
									fontSize: '1.25rem',
								}}>{product.price} {currency}</p>
								<button style={{
									width: '100%',
									backgroundColor: 'AccentColor',
									border: '0',
									borderRadius: '0.5rem',
									paddingBlock: '5%',
									fontSize: '1rem'
								}}>Ajouter au panier</button>
							</div>
						</div>
					))}
				</div>
			</div>
			<div style={{
				backgroundColor: 'Background',
				width: '100%'
			}}>All © rights reserved Boutique</div>
		</div>
	)
}