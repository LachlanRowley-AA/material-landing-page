import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import {
  Avatar,
  Badge,
  Box,
  Container,
  Flex,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import NextImage from 'next/image';
import classes from './index.module.css';

type Testimonial = {
  quote: string;
  name: string;
  imageUrl: string;
  handle: string;
  alt: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
    name: 'Dolore Magna',
    imageUrl:
      'https://assetalley.com.au',
    handle: '@sthompson',
    alt: 'dolore magna',
  },
];

const TestimonialCell = ({
  quote,
  name,
  imageUrl,
  handle,
  alt,
  ...paperProps
}: PaperProps & Testimonial) => (
  <Paper
    component="figure"
    radius="xl"
    p="xl"
    mx={0}
    w={320}
    my={0}
    className={classes.cell}
    {...paperProps}
  >
    <Flex direction="column" justify="space-between" h="100%">
      <Text component="blockquote">"{quote}"</Text>
      <Group mt="xl" align="start">
        <Avatar radius="xl" size="lg">
          {/* <NextImage src={imageUrl} alt={alt} fill /> */}
        </Avatar>
        <Box>
          <Text fz="lg" fw={500}>
            {name}
          </Text>
          <Text c="dimmed">{handle}</Text>
        </Box>
      </Group>
    </Flex>
  </Paper>
);

export const Testimonial01 = () => (
  <Container
    bg="var(--mantine-color-body)"
    py={{
      base: 'calc(var(--mantine-spacing-lg) * 4)',
      xs: 'calc(var(--mantine-spacing-lg) * 5)',
      lg: 'calc(var(--mantine-spacing-lg) * 6)',
    }}
    fluid
  >
    <Container size="md">
      <Stack gap="xs" align="center">
        <JumboTitle order={2} fz="md" ta="center" style={{ textWrap: 'balance' }} mb="sm">
          What our partners are saying
        </JumboTitle>
      </Stack>
    </Container>
    <Container size="xl">
      <Flex
        mt="calc(var(--mantine-spacing-lg) * 3)"
        gap="calc(var(--mantine-spacing-sm) * 3)"
        wrap="wrap"
        justify="center"
      >
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCell key={testimonial.name} {...testimonial} />
        ))}
      </Flex>
    </Container>
  </Container>
); export default Testimonial01;