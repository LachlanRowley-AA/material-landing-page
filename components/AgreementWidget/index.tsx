'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';
import { BiInfoCircle } from 'react-icons/bi';
import {
  Anchor,
  Box,
  Button,
  Card,
  Checkbox,
  FileInput,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { AskForBankstatement } from '@/components/AskForBankstatement';
import { AskForBankstatementFull } from '@/components/AskForBankstatementFull';
import { useUnsavedChanges } from '@/components/unsavedChanges';

type AgreementWidgetProps = {
  showDataShareCheckbox?: boolean;
};

export const AgreementWidget = ({ showDataShareCheckbox = true }: AgreementWidgetProps) => {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [dataShareTicked, setDataShare] = useState(!showDataShareCheckbox); // Default to true if checkbox is not shown
  const [privacyPolicyTicked, setPrivacyPolicy] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { unsavedChanges } = useUnsavedChanges();

  const handleCompleteApplication = () => {
    if (!dataShareTicked || !privacyPolicyTicked) {
      setError('You must agree to the above to proceed.');
      return;
    }
    if (unsavedChanges) {
      setError('You have unsaved changes to your account details');
      return;
    }
    setError('');
    sendGAEvent({ event: 'submitClicked', value: 'true' });
    if (uploadedFiles.length === 0) {
      open();
    } else {
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
        {showDataShareCheckbox && (
          <Checkbox
            label="I agree to share my data with Asset Alley"
            checked={dataShareTicked}
            onChange={(event) => setDataShare(event.currentTarget.checked)}
            size="md"
            w="100%"
          />
        )}
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
          checked={privacyPolicyTicked}
          onChange={(event) => setPrivacyPolicy(event.currentTarget.checked)}
        />

        {error && (
          <Text c="red" size="sm" mt="xs" ta="center">
            {error}
          </Text>
        )}
        <Box w="100%">
          <Tooltip label="Submit an eazytrade application to Asset Alley with 1 click" withArrow>
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
              rightSection={<BiInfoCircle size={14} />}
            >
              Submit
            </Button>
          </Tooltip>
          <Text size="sm" ta="center" mt="xs" fw="600">
            This will not impact your credit score
          </Text>
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
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          body: {
            padding: 0,
          },
        }}
      >
        {showDataShareCheckbox && <AskForBankstatement />}
        {
          !showDataShareCheckbox && <AskForBankstatementFull /> // The full application process as no prefilled data is available
        }
      </Modal>
    </Card>
  );
};
