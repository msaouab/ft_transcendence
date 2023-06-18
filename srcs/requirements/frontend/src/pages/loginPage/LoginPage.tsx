import styled from "styled-components";
import logoBlack from "/logoBlack.svg";
import ftlogo from "/ftlogoWhite.svg";
import lpPicture from "/login.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { HOSTNAME } from "../../api/axios";
const redirect = "http://" + HOSTNAME + ":3000/api/v1/login/42";
// import { Link } from 'react-router-dom';
const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  color: #000000;

  .loginPage {
    /* width: 100%; */
    /* height: 100vh; */
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: [first content-start] 1fr [content-end sidebar-start] 700px [lastline];
    .loginPagePicture {
      width: 100%;
      height: 100%;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
    .whiteBoard {
      background-color: white;
      display: grid;

      .logo {
        display: block;
        margin: 20rem auto;
        width: 30%;
        margin-bottom: 1rem;
        grid-template-rows: 4fr 1fr 1fr 1fr;
      }
      .ftbutton {
        color: white;
        background-color: black;
        box-shadow: 3px 3px #c2bfbf;
        display: flex;
        justify-content: space-evenly;
        border-radius: 25px;
        margin: 0 6rem;
        white-space: nowrap;
        overflow-x: auto;
        height: 3.5rem;
        padding: 1rem 0;
        div {
          display: inline-block;
          vertical-align: middle;
          height: auto;
          position: relative;
        }
        img {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .prvs {
        text-align: center;
        color: #005066 !important;

        a {
          text-decoration: none;
          display: inline-block;
          padding: 8px 16px;
          background-color: #005066;
          color: #ffffff;
          &:hover {
            scale: 1.1;
            transition: all 0.3s ease-in-out;
          }
        }
      }
      .previous {
        background-color: #cbc6c6;
        color: black;
      }
    }
    .terms {
      /* margin-top: -15rem; */
      text-align: center;
      a {
        text-decoration: underline;
        color: #004576;
      }
      p {
        padding: .5rem;
      }
      .rectangle {
        height: 7px;
        background-color: #a5a5a5;
        margin: 0 3rem;
        border-radius: 15rem;
      }
    }
  }
  @media screen and (max-width: 1426px) {
    .loginPage {
      display: flex;
      .whiteBoard {
        .logo {
          width: 50%;
        }
        .ftbutton {
          margin: 0 3rem;
        }
      }
    }
  }
  /*  */
  @media screen and (max-width: 768px) {
    .loginPage {
      display: block;
      overflow: hidden;
      background-image: url("/loginZoomed.jpg");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      .loginPagePicture {
        display: none;
      }

      .whiteBoard {
        height: 90%;
        width: 80%;
        margin: 3rem auto;
        background-color: rgba(255, 255, 255, 0.471);
        display: grid;
        .logo {
          filter: blur(0px);
          margin: 3rem auto;
        }

        font-weight: 500;
      }
    }
  }
`;

function LoginPage() {
  const [activeLink, setActiveLink] = useState<string>(
    "http://"+HOSTNAME+":3000/api/v1/login/42"
  );
  useEffect(() => {
    const storedLink = localStorage.getItem("activeLink");
    if (storedLink) {
      setActiveLink(storedLink);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeLink", activeLink);
  }, [activeLink]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };
  return (
    <LoginContainer className="lp ">
      <div className="loginPage">
        <div className="loginPagePicture">
          <img src={lpPicture} alt="Logo" className="lpPicture" />
        </div>
        <div className="whiteBoard">
          <img src={logoBlack} alt="Logo" className="logo" />
          {/* <Link to=""+HOSTNAME+":3000/api/v1/login/42" className={`ftauth`}> */}
          <Link to={redirect} rel="noreferrer">
            <div className="ftbutton">
              <img src={ftlogo} alt="42logo" className="ftlogo" />
              <div>
                <button className="play-now">Continue With 42</button>
              </div>
            </div>
          </Link>
          {/* </Link> */}
          <div className="prvs">
            <Link to="/" className="previous flex justify-center items-center">
              <TiArrowBack className="mr-2" />
            </Link>
            <p>Go Back</p>
          </div>
          <div className="terms">
            <p>
              By continuing, you agree to our{" "}
              <a href="https://42.fr/en/tos/" target="_blank" rel="noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://www.42.fr/en/privacy-policy/"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
            </p>
            <div className="rectangle"></div>
            <p className="">NOT ON PONG YET?</p>
            <Link
              to={redirect}
              className={`ftauth`}
              onClick={() =>
                handleLinkClick("http://"+HOSTNAME+":3000/api/v1/login/42")
              }
            >
              SIGN UP NOW!
            </Link>
          </div>
        </div>
      </div>
    </LoginContainer>
  );
}

export default LoginPage;
