import { useState } from 'react';
import { TextInput, Button, Group, Text, Stack, ThemeIcon, UnstyledButton, useMantineColorScheme, Modal, Paper } from "@mantine/core"
import { IconHome2, IconDeviceGamepad2, IconTrophy, IconUsers, IconSettings, IconLogin, IconUserPlus, IconSun, IconMoonStars } from "@tabler/icons-react"
import classes from './Navbar.module.css';
import { AuthenticationForm } from "../AuthenticationForm/AuthenticationForm"

const mainLinks = [
  { icon: IconHome2, label: "Home" },
  { icon: IconDeviceGamepad2, label: "Games" },
  { icon: IconTrophy, label: "Achievements" },
  { icon: IconUsers, label: "Friends" },
  { icon: IconSettings, label: "Settings" },
]

interface MainLinkProps {
  icon: React.FC<any>
  label: string
}

function MainLink({ icon: Icon, label }: MainLinkProps) {
  return (
    <UnstyledButton className={classes.mainLink}>
      <Group>
        <ThemeIcon variant="light">
          <Icon size="1.1rem" />
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export function Navbar() {
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [registerModalOpened, setRegisterModalOpened] = useState(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === "dark"

  const links = mainLinks.map((link) => <MainLink {...link} key={link.label} />)

  return (
    <>
      <Modal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
        title="Welcome back!"
        // centered
        // size="sm"
        // overlayProps={{
        //   className: classes.modalOverlay,
        // }}
        // classNames={{
        //   content: classes.modal,
        //   title: classes.modalTitle,
        // }}
      >
        <AuthenticationForm />
        {/* <Stack className={classes.modalForm}>
          <TextInput placeholder="Email" label="Email address" required />
          <TextInput placeholder="Password" label="Password" type="password" required />
          <Button fullWidth>Sign in</Button>
        </Stack> */}
      </Modal>

      <Modal
        opened={registerModalOpened}
        onClose={() => setRegisterModalOpened(false)}
        title="Create an account"
        centered
        size="sm"
        overlayProps={{
          className: classes.modalOverlay,
        }}
        classNames={{
          content: classes.modal,
          title: classes.modalTitle,
        }}
      >
        <Stack className={classes.modalForm}>
          <TextInput placeholder="Username" label="Username" required />
          <TextInput placeholder="Email" label="Email address" required />
          <TextInput placeholder="Password" label="Password" type="password" required />
          <TextInput placeholder="Confirm password" label="Confirm password" type="password" required />
          <Button fullWidth>Create account</Button>
        </Stack>
      </Modal>
      <div className={classes.navbarContainer}>
        <div className={classes.navbarMain}>
          <div className={classes.userSection}>
            <Group className={classes.authButtons}>
              <Button variant="default" leftSection={<IconLogin size={14} />} size="sm" onClick={() => setLoginModalOpened(true)}>
                Login
              </Button>
              <Button variant="filled" leftSection={<IconUserPlus size={14} />} size="sm" onClick={() => setRegisterModalOpened(true)}>
                Register
              </Button>
            </Group>
          </div>

          <Stack gap="sm">{links}</Stack>
        </div>

        {/* Custom animated toggle button at the bottom */}
        <Paper
          p="md"
          style={{
            borderTop: "1px solid var(--mantine-color-gray-3)",
            transition: "all 0.3s ease",
            backgroundColor: dark ? "var(--mantine-color-dark-6)" : "var(--mantine-color-gray-0)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 44,
              width: 100,
              margin: "0 auto",
              cursor: "pointer",
              background: dark ? "#222" : "#eee",
              borderRadius: 22,
              transition: "background 0.3s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
            onClick={() => toggleColorScheme()}
          >
            {/* Animated toggle knob */}
            <div
              style={{
                position: "absolute",
                top: 6,
                left: dark ? 56 : 6,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: dark ? "#ffd43b" : "#228be6",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 0.35s cubic-bezier(.7,.2,.3,1), background 0.3s",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconSun
                  size={24}
                  stroke={2}
                  color={dark ? "#fff" : "#fff"}
                  style={{
                    opacity: dark ? 0 : 1,
                    transform: dark ? "scale(0.7)" : "scale(1)",
                    transition: "opacity 0.25s, transform 0.25s",
                    position: "absolute",
                  }}
                />
                <IconMoonStars
                  size={24}
                  stroke={2}
                  color={dark ? "#222" : "#228be6"}
                  style={{
                    opacity: dark ? 1 : 0,
                    transform: dark ? "scale(1)" : "scale(0.7)",
                    transition: "opacity 0.25s, transform 0.25s",
                    position: "absolute",
                  }}
                />
              </div>
            </div>
            {/* Sun icon left, moon icon right, both fade depending on mode */}
            <div style={{ position: "absolute", left: 22, top: 12, opacity: dark ? 0.3 : 1, transition: "opacity 0.3s" }}>
              <IconSun size={20} stroke={2} color={dark ? "#888" : "#ffd43b"} />
            </div>
            <div style={{ position: "absolute", right: 22, top: 12, opacity: dark ? 1 : 0.3, transition: "opacity 0.3s" }}>
              <IconMoonStars size={20} stroke={2} color={dark ? "#ffd43b" : "#888"} />
            </div>
          </div>
        </Paper>
      </div>
    </>
  )
}