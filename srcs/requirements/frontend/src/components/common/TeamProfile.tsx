import styled from 'styled-components';
import Profile from '../../api/TeamData'

const TeamProfileContainer = styled.div`
	color: white;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 2rem;

	@media (max-width: 1200px) {
		grid-template-columns: repeat(4, 1fr);
	}

	@media (max-width: 992px) {
		grid-template-columns: repeat(3, 1fr);
	}

	@media (max-width: 768px) {
    	grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 576px) {
    	grid-template-columns: 1fr;
	}

	.memberTeam {
    	display: flex;
    	flex-direction: column;
    	justify-content: space-between;
    	padding: 1rem;
    	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		img {
			box-sizing: border-box;
			max-width: 100%;
    		width: 200px;
    		height: auto;
    		object-fit: cover;
			border: 6px solid var(--goldColor);
		}
		.nameProfile {
    	display: flex;
    	flex-direction: column;
    	align-items: center;
    	margin-top: 1rem;
    	h3 {
    	margin: 0;
		}
	}
    .SocialMedia {
      display: flex;
      justify-content: space-around;
      margin-top: 1rem;

      a {
        text-decoration: none;
        color: #988e8e;

        &:hover {
          color: #0077b5;
        }
      }
    }
  }
`;

function TeamProfile() {
  return (
    <TeamProfileContainer>
      {Profile.map((profile, i) => {
        const {  name, img, title, twitter, github, linkedin } = profile;
        return (
        	<div key={i} className='memberTeam'>
            	<img src={img} alt={name} />
				<div className='nameProfile'>
            		<h3>{name}</h3>
					<h3>{title}</h3>
				</div>
				<div className='SocialMedia'>
					<a href={linkedin} target="_blank">Linkedin</a>
					<a href={twitter} target="_blank">Twitter</a>
					<a href={github} target="_blank">Github</a>
				</div>
        	</div>
        )
      })}
    </TeamProfileContainer>
  );
}

export default TeamProfile;
