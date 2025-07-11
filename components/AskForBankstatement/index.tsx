'use client';

import { useState } from 'react';
import {
  Card,
  Button,
  Text,
  FileInput,
  Stack,
  Divider,
  rem,
  Notification,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export const AskForBankstatement = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendToLendAPI = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
        const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
       body: JSON.stringify({
        owner: {
            first_name: 'TestFirstName',
            last_name: 'TestLastName',
            contact_number: '012345678',
            email: 'testEmail@email.com',
        },
        lead: {
            organisation_name: 'TestCompany',
            industry_id: '189',
            purpose_id: '1',
            amount_requested: '5.49',
            sales_monthly: '-1',
            company_registration_date: '1444/11/11',
            campaign: 'Test Campaign',
            loan_term_requested: '4',
        },
        lead_notes: [
            {
            notes: 'referred by [A]',
            },
        ],
        })
        });

      if (res.ok) {
        setSuccess('Application submitted successfully');
      } else {
        const text = await res.text();
        setError(`Submission failed: ${res.status} - ${text}`);
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    sendToLendAPI();
  };

  const handleIlionClick = () => {
    sendToLendAPI();
    router.push('/bankstatements');
  };

  return (
    <Card
      shadow="lg"
      radius="xl"
      p={{base:"md", md: "xl"}}
      withBorder
      style={{
        border: `2px solid #fc8900`,
        background: 'linear-gradient(135deg, #fff9f0, #ffffff)',
      }}
    >
      <Stack gap="lg">
        <JumboTitle order={2} fz={rem(20)} ta="center" c="#fc8900" style={{ fontWeight: 700 }}>
          Get ahead of approval by uploading your business bank statements
        </JumboTitle>

        <FileInput
          label="Upload your bank statements"
          placeholder="Choose file(s)"
          leftSection={<IconUpload size={18} />}
          radius="md"
          withAsterisk
          value={file}
          onChange={setFile}
          styles={{
            input: {
              borderColor: '#fc8900',
              '&:focusWithin': {
                borderColor: '#fc8900',
              },
            },
            label: {
              color: '#fc8900',
              fontWeight: 600,
            },
          }}
        />

        <Divider label="OR" labelPosition="center" color="#fc8900" />

        <Button
          fullWidth
          radius="md"
          size="md"
          style={{
            backgroundColor: '#fc8900',
            color: 'white',
            fontWeight: 600,
          }}
          onClick={handleIlionClick}
          loading={loading}
          styles={{
              label: {
                whiteSpace: 'normal',  
                lineHeight: 1.25,      
                textAlign: 'center', 
              },
            }}

        >
          Provide your bank statements through Ilion
        </Button>

        <Button
            fullWidth
            radius="md"
            size="md"
            variant="outline"
            color="dark"
            onClick={handleUploadClick}
            loading={loading}
            /* Styles API – override the label only */
            styles={{
              label: {
                whiteSpace: 'normal',   // allow line‑breaks (use 'unset' or 'normal')
                lineHeight: 1.25,      // optional – tidier vertical spacing
                textAlign: 'center',   // optional – nicer on multi‑line buttons
              },
            }}
          >
            {file
              ? 'Submit Application'
              : 'No thanks, continue without uploading'}
          </Button>
        {success && (
          <Notification icon={<IconCheck />} color="green" title="Success" onClose={() => setSuccess(null)}>
            {success}
          </Notification>
        )}

        {error && (
          <Notification icon={<IconX />} color="red" title="Error" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}
      </Stack>
    </Card>
  );
};
