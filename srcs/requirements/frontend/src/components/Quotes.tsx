import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const QuotesContainer = styled.div`
	color: white;
	text-align: center;
	font-size: 2rem;
	max-width: 30rem;
	margin: 2rem auto;
	.spinner {
  		width: 50px;
  		height: 50px;
  		border-radius: 50%;
  		border: 5px solid rgba(0, 0, 0, 0.1);
  		border-top-color: var(--goldColor);
  		animation: spin 1s ease-in-out infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.author {
		font-size: 1.5rem;
		font-family: 'Poiret One';
	}
`;

function	Quotes() {
	const [loading, setLoading] = useState(true);
	const [quote, setQuote] = useState({
		content: '',
		author: ''
	});

	useEffect(() => {
		setLoading(true);
		axios.get('https://api.quotable.io/random')
		.then(response => {
			setQuote(response.data)
			setLoading(false);
		})
		.catch(error => setLoading(false))
	}, []);

	return (
		<QuotesContainer>
			{
				loading ? ( <div className='spinner'></div> ) : (
					<>
						<p className='content'><span>“</span>{quote.content}<span>”</span></p>
						<p className='author'>- {quote.author}</p>
					</>
				)
			}
		</QuotesContainer>
	)
}

export	default Quotes
