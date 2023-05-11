import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props:  { background: any;  }) => props.background};
    color: ${(props:  { textColor: any;  }) => props.textColor};
    
  }
`;

export default GlobalStyle;
