import { ActionIcon, Container, Group, Text } from "@mantine/core"
import { IconBrandGithub, IconBrandLinkedin, IconBrandItch } from "@tabler/icons-react"

export const Footer = () => {
  return (
    <footer>
      <Container
        size="md"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderTop: "1px solid var(--mantine-color-dark-4)",
        }}
      >
        <Text size="sm">© 2025 Created by Mateusz Binięda. All rights reserved.</Text>

        <Group gap="xs">
          <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://github.com/Arssin" target="_blank">
            <IconBrandGithub style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>

          <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://linkedin.com/in/mateusz-binieda" target="_blank">
            <IconBrandLinkedin style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>

          <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://arssin.itch.io" target="_blank">
            <IconBrandItch style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  )
}
