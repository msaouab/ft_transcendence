import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background-color: ${(props:  { background: any;  }) => props.background};
    color: ${(props:  { txtColor: any;  }) => props.textColor};
    color : #ffffff;
    /* background-color: #7a7a7a; */
  }
`;

export default GlobalStyle;
