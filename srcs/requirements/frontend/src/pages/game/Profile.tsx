import PadelSvg from "../../assets/icons/PadelSvg";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const ReusableCardStyle = styled.div`
  background: linear-gradient(
    180deg,
    rgba(233, 217, 144, 0.2379) 0%,
    rgba(233, 217, 144, 0) 100%
  );
  border-radius: 20px 20px 0px 0px;
  padding: 1rem;
`;

const Achivements = [
  {
    title: "First Game",
    description: "You played your first game",
  },
  {
    title: "Comeback Kid",
    description: "You won a game after being down 5-0",
  },
  {
    title: "Winning Streak",
    description: "You won 5 games in a row",
  },
  {
    title: "Strategist",
    description:
      "Win a game without hitting any balls with the same type of shot twice Win a game without hitting any balls with the same type of shot twice",
  },
];

const AchivementCard = styled.div`
background: rgba(255, 255, 255, 0.1);
padding: 1rem;
  .title {
    font-size: 2rem;
    font-weight: 800;
  }
  .description {
    font-size: 1.5rem;
    font-weight: 500;
  }
`;

const Profile = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <ReusableCardStyle className="profile-card    w-[35rem] min-h-[12rem] ">
        <div className="name text-6xl font-[800] mb-6">Hello Ilyass</div>
        <div className="flex gap-16 items-center ">
          <div className="text-2xl">It’s good to see you again.</div>
          <div className="padel">
            l
            <PadelSvg />
          </div>
        </div>
      </ReusableCardStyle>
      <ReusableCardStyle className="min-h-[20rem]">
        <div className="top flex justify-between items-center mb-4">
          <h1>LAST ACHIEVEMENTS</h1>
          <Link
            to="/game"
            className="text-[#E9D990] border border-[#E9D990] p-2"
          >
            SEE ALL ACHIEVEMENTS
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">

        {Achivements.map((achivement, index) => (
          <AchivementCard  key={index}>
            <div className="title">{achivement.title}</div>
            <div className="description">{achivement.description}</div>
          </AchivementCard>
        ))}
        </div>
      </ReusableCardStyle>
    </div>
  );
};

export default Profile;
