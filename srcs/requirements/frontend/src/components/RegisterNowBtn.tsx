import arrowbtn from '../assets/arrowbtn.svg';
import styled from 'styled-components'

const RegisterNowBtnContainer = styled.div`
	button {
		font-family: 'Oxanium';
		font-size: 1.5rem;
		background-color: transparent;
		color: white;
		border: 2px solid #E9D990;
		border-radius: 10px;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		padding: 12px 25px 12px 40px;
		cursor: pointer;
		img {
			box-sizing: border-box;
			margin-left: .3rem;
		}
	}
`;

function RegisterNowBtn() {
	return (
		<RegisterNowBtnContainer>
			<button>Register Now
				<img src={arrowbtn} alt="arrow-Btn" />
			</button>
		</RegisterNowBtnContainer>
	)
}

export default RegisterNowBtn