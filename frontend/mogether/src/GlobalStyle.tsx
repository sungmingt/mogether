import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Maplestory Light';
    src: url('./assets/fonts/Maplestory Light.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Maplestory Bold';
    src: url('./assets/fonts/Maplestory Bold.ttf') format('truetype');
  }

  body {
    font-family: 'Maplestory Light', sans-serif; /* 기본적으로 Light 폰트 사용 */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
