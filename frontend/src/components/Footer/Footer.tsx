import { ActionIcon, Container, Group, Text } from "@mantine/core"
import { IconBrandGithub, IconBrandLinkedin, IconBrandItch, IconBrandX } from "@tabler/icons-react"
import className from "./Footer.module.css"

export const Footer = () => {
  return (
    <footer>
      <Container size="md">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            borderTop: "1px solid var(--mantine-color-dark-4)",
          }}
        >
           <Text size="xs" c="dimmed" ta="left" style={{ margin: "0 auto", lineHeight: 1.6 }}>
            <strong>Disclaimer:</strong> This is a demonstration project showcasing programming skills and is not a real gambling platform. 
            All games are simulated and do not involve real money or monetary transactions. This application is intended for educational 
            and portfolio purposes only.
          </Text>

          <Text size="xs" c="dimmed" ta="left" style={{ margin: "0 auto", lineHeight: 1.6 }}>
            <strong>Responsible Gaming Warning:</strong> Gambling can be addictive and may lead to financial difficulties. This demonstration 
            is not intended to promote or encourage gambling activities. If you or someone you know has a gambling problem, please seek help 
            by contacting appropriate support services in your area.
          </Text>

          <Text size="xs" c="dimmed" ta="left" style={{ margin: "0 auto", lineHeight: 1.6 }}>
            <strong>Legal Notice:</strong> The games and content presented here are for demonstration purposes only and are protected by 
            intellectual property rights. Any resemblance to real gambling products or services is purely coincidental. Users must be of 
            legal age to view gambling-related content in their jurisdiction.
          </Text>
          <div className={className["bottom-footer-content"]}>
            <Text size="xs">© 2025 Created by Mateusz Binięda. All rights reserved.</Text>

            <Group gap="xs">
              <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://github.com/Arssin" target="_blank">
                <IconBrandGithub style={{ width: "70%", height: "70%", color: '#da9545' }} stroke={1.5} />
              </ActionIcon>

              <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://www.linkedin.com/in/mateusz-binięda-818141209" target="_blank">
                <IconBrandLinkedin style={{ width: "70%", height: "70%", color: '#da9545'  }} stroke={1.5} />
              </ActionIcon>

              <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://arssin.itch.io" target="_blank">
                <IconBrandItch style={{ width: "70%", height: "70%" , color: '#da9545' }} stroke={1.5} />
              </ActionIcon>
                  <ActionIcon size="lg" color="gray" variant="subtle" component="a" href="https://x.com/ArssinDev" target="_blank">
                     <IconBrandX style={{ width: "70%", height: "70%" , color: '#da9545' }} stroke={1.5} />
              </ActionIcon>
            </Group>
          </div>
        </div>
      </Container>
    </footer>
  )
}
