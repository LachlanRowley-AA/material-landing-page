'use client';

import Link from 'next/link';
import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Image, Paper, Stack, Text, Title } from '@mantine/core';

export default function ThanksPage() {
  return (
    <div style={{height:"100vh", width:"100vw", backgroundColor:"#f9f9f9"}}>
      <Container size="sm" h="100vh" style={{ display: 'flex', alignItems: 'center' }} bg="#f9f9f9">
        <Paper withBorder shadow="md" radius="lg" p="xl" w="100%" style={{ textAlign: 'center' }}>
          <Stack align="center">
            <Image src="/logo.svg" alt="EazyTrade Logo" w={180} />

            <IconCheck size={48} color="green" />

            <Title order={2} c="green" fw={700}>
              Thank you!
            </Title>

            <Text size="lg" fw={500}>
              Your details have been submitted successfully.
            </Text>
            <Text size="sm">
              We'll be in touch with you shortly.
            </Text>
            <Text size="sm" my={0} py={0}>
                Need to upload bank statements?
            </Text>
            <Button
              component={Link}
              href="/bankstatements"
              target="_blank"
              variant="light"
              color="blue"
              mt={0}
              radius="md"
            >
              Click here
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
