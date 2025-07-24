import { useState } from 'react';
import {
  TextInput,
  Button,
  Group,
  Text,
  Stack,
  ThemeIcon,
  UnstyledButton,
  Switch,
  useMantineColorScheme,
  Divider,
  ActionIcon,
  Paper,
} from '@mantine/core';
import type { ButtonProps } from '@mantine/core';
import {
  IconSearch,
  IconHome2,
  IconDeviceGamepad2,
  IconTrophy,
  IconUsers,
  IconSettings,
  IconLogin,
  IconUserPlus,
  IconSun,
  IconMoonStars,
} from '@tabler/icons-react';

const mainLinks = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconDeviceGamepad2, label: 'Games' },
  { icon: IconTrophy, label: 'Achievements' },
  { icon: IconUsers, label: 'Friends' },
  { icon: IconSettings, label: 'Settings' },
];

interface MainLinkProps {
  icon: React.FC<any>;
  label: string;
}

function MainLink({ icon: Icon, label }: MainLinkProps) {
  return (
    <UnstyledButton
      style={{
        display: 'block',
        width: '100%',
        padding: '12px',
        borderRadius: '4px',
      }}
    >
      <Group>
        <ThemeIcon variant="light">
          <Icon size="1.1rem" />
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

export function NavbarSearch() {
  const [search, setSearch] = useState('');
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const links = mainLinks.map((link) => (
    <MainLink {...link} key={link.label} />
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px' }}>
        <Group justify="space-between" mb="md">
          <Group>
            <Button 
              variant="default" 
              leftSection={<IconLogin size={14} />}
              size="sm"
            >
              Login
            </Button>
            <Button 
              variant="filled" 
              leftSection={<IconUserPlus size={14} />}
              size="sm"
            >
              Register
            </Button>
          </Group>
          
          <Switch
            checked={dark}
            onChange={() => toggleColorScheme()}
            size="md"
            onLabel={<IconSun size="1rem" stroke={1.5} />}
            offLabel={<IconMoonStars size="1rem" stroke={1.5} />}
          />
        </Group>
        
        <TextInput
          placeholder="Search"
          size="md"
          leftSection={<IconSearch size="1.1rem" stroke={1.5} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          mb="md"
        />
        
        <Divider mb="md" />
        
        <Stack gap="sm">{links}</Stack>
      </div>
    </div>
  );
}