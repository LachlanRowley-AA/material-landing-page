import { Card, Container, Flex, Group, Radio, Select, Text } from '@mantine/core';
import { JumboTitle } from '../JumboTitle/JumboTitle';

export default function ProductChoice() {
  const data = [
    'You want extra time to pay for your purchases',
    'You want to break your payment up over the next 6-36 months',
    'You will need to make frequent purchases',
  ];
  return (
    <Container my="xl">
      <JumboTitle
        order={3}
        fz="xs"
        ta="center"
        style={{ textWrap: 'balance' }}
        c={{ base: 'black', md: 'black' }}
        fw={600}
        my="md"
      >
        Choose which fits you best
      </JumboTitle>
      {data.map((i) => (
        <Card
          key={i}
          style={{
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
          }}
          pb="md"
          my='md'
          pt={0}
          px={0}
          mx="lg"
        >
          <Flex
            wrap="wrap"
            gap="xs"
            px="md"
            py="xs"
            align="center"
            justify="start"
            style={{ flex: `1 1 auto`, minWidth: 0 }}
          >
            <Group gap={0} align="center" mr="md">
 
              {/* {product.logo && (<Image src={product.logo || null} w={170} my={-10} py={-10}/>) } */}
              <Text fw={600} c="black" fz={{ base: 'md', md: 'lg' }} ta="center" pl={0}>
                {i}
              </Text>
            </Group>
            </Flex>
        </Card>
      ))}
    </Container>
  );
}
