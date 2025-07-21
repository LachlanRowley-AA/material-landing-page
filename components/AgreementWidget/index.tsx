'use client';

import { useRouter } from 'next/navigation';
import {
  Anchor,
  Button,
  Card,
  Checkbox,
  Group,
  Stack,
  Text,
  Image,
  Title,
  Box,
  Tooltip,
  FileInput,
  Modal,
  useMantineTheme
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { BiInfoCircle } from "react-icons/bi";
import { IconUpload } from '@tabler/icons-react';
import { AskForBankstatement } from "@/components/AskForBankstatement";
import { useDisclosure } from "@mantine/hooks";


export const AgreementWidget = () => {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [dataShareTicked, setDataShare] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [opened, {open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const handleCompleteApplication = () => {
    if (!dataShareTicked) {
      setError('You must agree to share your data to proceed.');
      return;
    }
    setError('');
    if (uploadedFiles.length===0) {
      open()
    }
    else {
      // router.push('/application');
    }
  };


  return (
    <Card
      radius="lg"
      withBorder
      p="xl"
      mt="md"
      bg="#ffffff"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #eee',
      }}
    >
      <Stack align="center">
        <Image src="/assetalley.svg" w={160} alt="Asset Alley Logo" />

        <Title order={3} c={theme.colors.secondary[0]}>
          Let's get started
        </Title>
        {/* <Checkbox
          label="I agree to share my data with Asset Alley"
          checked={dataShareTicked}
          onChange={(event) => setDataShare(event.currentTarget.checked)}
          size="md"
          w="100%"
        /> */}
        <Checkbox
          w="100%"
          size="md"
          label={
            <>
              I accept the{' '}
              <Anchor size="sm" href="/privacyform" c="#fc8900">
                privacy policy
              </Anchor>{' '}
              of Asset Alley
            </>
          }
          checked={dataShareTicked}
          onChange={(event) => setDataShare(event.currentTarget.checked)}
        />

        {error && (
          <Text c="red" size="sm" mt="xs" ta="center">
            {error}
          </Text>
        )}
        <Box w="100%">
          <Tooltip label="Jump straight into the full application process." withArrow>
            <Button
              fullWidth
              size="md"
              color="#fc8900"
              style={{
                backgroundColor: '#fc8900',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 0 12px rgba(252, 137, 0, 0.5)',
              }}
              onClick={handleCompleteApplication}
              rightSection={<BiInfoCircle size={14}/>}
              >
              Submit
            </Button>
          </Tooltip>
        </Box>
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        withCloseButton={false}
        styles={{
          content: {
            padding: 0,
            backgroundColor: 'transparent', // Remove background if your Card already has one
            boxShadow: 'none',
          },
          body: {
            padding: 0,
          },
        }}
      >
        <AskForBankstatement />
      </Modal>
  </Card>
  );
};
