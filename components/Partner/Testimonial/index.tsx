import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import {
  Avatar,
  Badge,
  Box,
  Container,
  Flex,
  Group,
  Image,
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
  company: string;
  alt: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      `eazytrade has helped our business substantially, by providing our customers with flexible options at times they needed it most.
      The Asset Alley team are extremely professional and trustworthy, and I know they put my customers first everyime`,
    name: 'Charlie Daoud',
    imageUrl: './charlie.jpg',
    company: 'Discount Building Material',
    alt: 'Charlie Daud',
  },
];

const TestimonialCell = ({
  quote,
  name,
  imageUrl,
  company,
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
      <Group mt="md" align="center">
        <Avatar radius="xl" size="lg">
          <Image src={imageUrl} alt={alt} />
        </Avatar>
        <Box>
          <Text fz="lg" fw={500}>
            {name}
          </Text>
          <Text fz="sm" c="gray">
            {company}
          </Text>
        </Box>
      </Group>
    </Flex>
  </Paper>
);

export const Testimonial01 = () => (
  <Container
    bg="var(--mantine-color-body)"
    py={{
      base: 'calc(var(--mantine-spacing-lg) * 3)',
      xs: 'calc(var(--mantine-spacing-lg) * 3)',
      lg: 'calc(var(--mantine-spacing-lg) * 3)',
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