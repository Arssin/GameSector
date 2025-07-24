import "./App.css"
import { BrowserRouter } from "react-router-dom"
import { SlotMachine } from "./components/SlotMachine"
import { MantineProvider, createTheme, MantineColorsTuple, AppShell, Group, Burger, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import { Footer } from "./components/Footer"
import "@mantine/core/styles.css"
import { NavbarSearch } from "./components/NavbarSearch"

const myColor: MantineColorsTuple = ["#fcf5ee", "#f5e9dc", "#edd1b2", "#e5b884", "#dea25d", "#da9545", "#d88e38", "#c07a2a", "#ab6c23", "#42290b"]

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
  primaryShade: 5,
})

function App() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
          styles={{
            main: {
              background: "var(--mantine-color-dark-8)",
            },
            header: {
              background: "var(--mantine-color-dark-7)",
              borderBottom: "1px solid var(--mantine-color-dark-4)",
            },
            navbar: {
              background: "var(--mantine-color-dark-7)",
              borderRight: "1px solid var(--mantine-color-dark-4)",
            },
          }}
        >
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
              <Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Title order={3}>Game Sector</Title>
              </Group>
            </Group>
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <NavbarSearch />
          </AppShell.Navbar>

          <AppShell.Main>
            <div
              style={{
                maxWidth: "100%",
                height: "calc(100vh - 60px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "var(--mantine-color-dark-8)",
              }}
            >
              <div
                style={{
                  maxWidth: "1200px",
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "var(--mantine-radius-md)",
                  background: "var(--mantine-color-dark-6)",
                  padding: "2rem",
                }}
              >
                <SlotMachine />
              </div>
              <div style={{ width: "100%" }}>
                <Footer />
              </div>
            </div>
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
