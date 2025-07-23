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
import { UserDetails } from '@/lib/UserDetails';

export const AskForBankstatement = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);

  const sendToLendAPI = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      setError('User data not found in session storage.');
      setLoading(false);
      return;
    }
    const parsedUserData: UserDetails = JSON.parse(userData);
    let [first, ...lastArr] = parsedUserData.name.split(' ');
    let last = lastArr.join(' ');
    first = first || 'Missing First Name';
    last = last || 'Missing Last Name';
    let lendTimeframe: string;
    switch (sessionStorage.getItem('customTimeframe')) {
      case '6':
        lendTimeframe = '4';
        break;
      case '12':
        lendTimeframe = '15';
        break;
      case '24':
        lendTimeframe = '17';
        break;
      case '36':
        lendTimeframe = '18';
        break;
      default:
        lendTimeframe = '44';
        break;
    }
    console.log('Lend Timeframe:', lendTimeframe);

    try {
        const res = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
       body: JSON.stringify({
        owner: {
            first_name: first,
            last_name: last,
            contact_number: parsedUserData.phoneNumber || '0000000000',
            email: parsedUserData.email || '',
        },
        lead: {
            organisation_name: parsedUserData.company || 'Unknown Company',
            industry_id: '189',
            purpose_id: '1',
            amount_requested: sessionStorage.getItem('loanAmount') || '-1',
            sales_monthly: '-1',
            company_registration_date: '1444/11/11',
            campaign: 'Test Campaign',
            loan_term_requested: lendTimeframe,
        },
        lead_notes: [
            {
            notes: 'referred by Eazypay',
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
    if(file) {
      const userData = sessionStorage.getItem('userData');
      const formData = new FormData();
      formData.append('invoices', file);
      const parsedUserData: UserDetails = userData ? JSON.parse(userData) : {};
      formData.append('company_name', parsedUserData.company || 'Unknown Company');

      fetch('/api/uploadBank', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setSuccess('File uploaded successfully');
          }
        })
        .catch(err => setError(`Upload failed: ${err.message}`));
    }
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
