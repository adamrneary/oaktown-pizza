import { Head } from "next/document";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "../styles/globals.css";

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: "2rem",
      marginBottom: 16,
    },
    h2: {
      fontSize: "1.5rem",
      marginTop: 48,
      marginBottom: 16,
    },
    fontFamily: [
      "Lora",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
