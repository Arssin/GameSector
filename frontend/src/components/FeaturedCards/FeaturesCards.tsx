import { IconCookie, IconGauge, IconUser } from '@tabler/icons-react';
import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import classes from './FeaturesCards.module.css';

const mockdata = [
  {
    title: "Personal project, pure fun!",
    description: "Game Sector is my own casino playground – no stress, no risk, just pure fun and code! Built after hours, driven by passion for games.",
    icon: IconGauge,
  },
  {
    title: "Play, test, enjoy!",
    description: "Slots, machines, experiments – all in one place. You won’t win millions here, but you’ll see how real casino mechanics work!",
    icon: IconUser,
  },
  {
    title: "No ads, no tricks",
    description: "No hidden fees, no annoying popups. Just a demo showing how to build a casino in React!",
    icon: IconCookie,
  },
]

export function FeaturesCards() {
  const theme = useMantineTheme()
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon size={50} stroke={1.5} color={theme.colors.blue[6]} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ))

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Play and enjoy – all in one place!
      </Title>

      <Group justify="center">
        <Badge variant="filled" size="lg" color="orange">
          Private casino project - just for fun!
        </Badge>
      </Group>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        This is a personal demo showing how casino games work under the hood. No ads, no tricks, just pure entertainment and a bit of code magic. Try your luck and see how slots are made!
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  )
}