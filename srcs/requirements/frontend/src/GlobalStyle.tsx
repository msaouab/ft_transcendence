import { createGlobalStyle } from "styled-components";

interface GlobalStyleProps {
  background: string;
  txtColor: string;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background-color: ${(props) => props.background};
    color: ${(props) => props.txtColor};
  }
`;

export default GlobalStyle;
