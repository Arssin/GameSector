import "./App.css"
import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import { SlotMachine } from "./components/SlotMachine/SlotMachine"
import { createTheme, MantineColorsTuple, AppShell, Group, Burger, Title, ActionIcon, MantineProvider, ColorSchemeScript } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconSun, IconMoonStars } from "@tabler/icons-react"
import { Footer } from "./components/Footer"
import "@mantine/core/styles.css"
import { Navbar } from "./components/Navbar/Navbar"

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
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark")

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
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
                background: "var(--mantine-color-body)",
              },
              header: {
                background: "var(--mantine-color-default)",
                borderBottom: "1px solid var(--mantine-color-default-border)",
              },
              navbar: {
                background: "var(--mantine-color-default)",
                borderRight: "1px solid var(--mantine-color-default-border)",
              },
            }}
          >
            <AppShell.Header>
              <Group h="100%" px="md" justify="space-between">
                <Group>
                  <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                  <Title order={3}>Game Sector</Title>
                </Group>
                <ActionIcon variant="outline" color={colorScheme === "dark" ? "yellow" : "blue"} onClick={toggleColorScheme} title="Toggle color scheme">
                  {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                </ActionIcon>
              </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
              <Navbar />
            </AppShell.Navbar>

            <AppShell.Main>
              <SlotMachine />

              <div style={{ width: "100%" }}>
                <Footer />
              </div>
            </AppShell.Main>
          </AppShell>
        </BrowserRouter>
      </MantineProvider>
    </>
  )
}

export default App
