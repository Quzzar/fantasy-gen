import {
  ColorSchemeProvider,
  MantineProvider,
  AppShell,
  BackgroundImage,
} from "@mantine/core";
import MainPage from "./MainPage";
import Background from "../public/background.svg";

export default function App() {

  return (
    <ColorSchemeProvider colorScheme={"light"} toggleColorScheme={() => {}}>
      <MantineProvider
        theme={{
          colorScheme: "light",
          fontFamily: "Montserrat, sans-serif",
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          padding="md"
          header={<></>}
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
              // backgroundImage: Background,
              padding: 0,
              minHeight: "initial",
              display: "flex",
              justifyContent: "space-around",
            },
          })}
        >
          <BackgroundImage src={Background} radius={0} w="100vw" h="100vh">
            <MainPage />
          </BackgroundImage>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
