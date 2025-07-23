'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Text,
  FileInput,
  Stack,
  Divider,
  rem,
  Notification,
  Group
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { UserDetails } from '@/lib/UserDetails';

export const AskForBankstatement = () => {
  const router = useRouter();
  const [file, setFile] = useState<File[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  const [step, setStep] = useState<'form' | 'upload' | 'thankyou'>('form');


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

  useEffect(() => {
    const savedStep = sessionStorage.getItem('bankFormStep');

    if (savedStep === 'upload' || savedStep === 'thankyou') {
      setStep(savedStep);
    }
  }, []);

  const handleStepChange = (newStep: typeof step) => {
    setStep(newStep);
    sessionStorage.setItem('bankFormStep', newStep);
  };


  const handleUploadClick = () => {
    sendToLendAPI();
   if (file && file.length > 0) {
      const userData = sessionStorage.getItem('userData');
      const parsedUserData: UserDetails = userData ? JSON.parse(userData) : {};
      const formData = new FormData();
      file.forEach((f) => {
        formData.append('invoices', f);
      });
      formData.append('company_name', parsedUserData.company || 'Unknown Company');

      fetch('/api/uploadBank', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setSuccess('Files uploaded successfully');
            setTimeout(() => {
              setSuccess(null);
              handleStepChange('thankyou');
            }, 1000);
          }
        })
        .catch((err) => setError(`Upload failed: ${err.message}`));
    } else {
      handleStepChange('thankyou');
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
        {step !=='thankyou' && (
          <div>
            <Stack gap="lg">
            <FileInput
              label="Upload your bank statements"
              placeholder="Choose file(s)"
              leftSection={<IconUpload size={18} />}
              radius="md"
              withAsterisk
              multiple
              onChange={(event) => {
                const selected = Array.isArray(event) ? event : event ? [event] : [];
                setFile((prev) => [...(prev || []), ...selected]);
              }}
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
            {file && file.length > 0 && (
              <Stack gap="xs">
                {file.map((f, index) => (
                  <Group key={index} justify="space-between">
                    <Text size="sm">{f.name}</Text>
                    <Button
                      size="xs"
                      color="red"
                      variant="subtle"
                      onClick={() => setFile((prev) => prev?.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </Group>
                ))}
              </Stack>
            )}

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
              </Stack>
            </div>
          )}
        {step === 'thankyou' && (
          <Text ta="center" size="lg" fw={600} c="green">
            Thanks for submitting your details. We'll be in touch soon!
          </Text>
        )}

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
