import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background-color: ${(props:  { background: any;  }) => props.background};
    color: ${(props:  { textColor: any;  }) => props.textColor};
    /* height: 100vh ;
    width: 100vw; */
    /* background-color: #7a7a7a; */
  }
`;

export default GlobalStyle;
