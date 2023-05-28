import styled from "styled-components";

export const Status = styled.div<{ userStatus: string }>`
position: relative;
/* width: 100px; */
/* aspect-ratio: 1/1; */
height: 100%;
img {
  position: relative;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  object-fit: cover;
  @media (max-width: 1200px) {
	height: 70px;
	width: 70px;
  }
}
&:after {
  content: "";
  position: absolute;
  bottom: 5px;
  right: 10%;
  background-color: ${({ userStatus }:any) =>
	userStatus === "online"
	  ? "#00ff00"
	  : userStatus === "offline"
	  ? "#6a6a6a"
	  : userStatus === "donotdisturb"
	  ? "#ff0000"
	  : userStatus === "ingame"
	  ? "#011c77"
	  : "#ffcc00"};
  border: 1px solid #ececec;
  width: 15%;
  height: 15%;
  border-radius: 50%;
}
`;

export const Top = styled.div`
@media (max-width: 1200px) {
  display: unset;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
`;

export const Main = styled.div`
@media (max-width: 1200px) {
  flex-direction: column;
  .stats {
	height: unset;
	min-height: fit-content;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	& > div {
	  max-width: 70%;
	  min-width: 360px;
	  max-height: 500px;
	}
  }
  .achievements {
	/* height: 500px; */
	width: 100%;
	.achiv-container {
	  display: flex;
	  flex-direction: column;
	}
  }
}
@media (max-width: 800px) {
  flex-direction: column;
  .stats {
	height: unset;
	min-height: fit-content;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	& > div {
	  max-width: 90%;
	  min-width: 360px;
	  max-height: 500px;
	}
  }
  .achievements {
	/* height: 500px; */
	.achiv-container {
	  display: flex;
	  flex-direction: column;
	  width: unset;
	  max-width: 90%;
	}
  }
}
`;