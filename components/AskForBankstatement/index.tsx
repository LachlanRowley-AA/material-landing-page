'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Button,
  Text,
  FileInput,
  Stack,
  Notification,
  Group,
  rem,
  Tooltip,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { UserDetails } from '@/lib/UserDetails';

export const AskForBankstatement = () => {
  const router = useRouter();
  const [file, setFile] = useState<File[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [illionLoading, setIllionLoading] = useState(false);
  const [noIllionLoading, setNoIllionLoading] = useState(false);
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
            industry_id: '62',
            purpose_id: '15',
            product_type_id: '1',
            amount_requested: sessionStorage.getItem('loanAmount') || '-1',
            sales_monthly: '-1',
            company_registration_date: '1444/11/11',
            campaign: 'Test Campaign',
            loan_term_requested: lendTimeframe,
            ...(process.env.NEXT_PUBLIC_LEND_MODE === 'live' && { referrer_person_ref: 'Z2RLL54' }),
          },
          lead_notes: [
            {
              notes: 'referred by eazytrade',
            },
          ],
        }),
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
    fetchUserIP();
    const savedStep = sessionStorage.getItem('bankFormStep');
    if (savedStep === 'upload' || savedStep === 'thankyou') {
      setStep(savedStep);
    }
  }, []);

  const handleStepChange = (newStep: typeof step) => {
    setStep(newStep);
    sessionStorage.setItem('bankFormStep', newStep);
  };

  const [ip, setIp] = useState<string | null>(null);
  const ipService = 'https://api.ipify.org?format=json';

  const fetchUserIP = useCallback(async () => {
    try {
      
      const response = await fetch(ipService);
      if (!response.ok) {
        throw new Error('Failed to fetch IP address');
      }
      
      const data = await response.json();
      if (!data.ip) {
        throw new Error('Invalid IP response');
      }
      
      setIp(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      setIp('IP_FETCH_FAILED');
    }
  }, []);


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
      formData.append('ipAddress', ip || 'IP_FETCH_FAILED');
      formData.append('name', parsedUserData.name || 'Unknown');

      const date = new Date()
      const formattedDate = date.toLocaleDateString('en-AU', {
          day: '2-digit' as const,
          month: '2-digit' as const,
          year: 'numeric' as const
      })
      formData.append('date', formattedDate);

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
    handleUploadClick();
    router.push('/bankstatements');
  };

  return (
    <Card
      shadow="lg"
      radius="xl"
      p={{ base: 'md', md: 'xl' }}
      withBorder
      style={{
        border: `2px solid #fc8900`,
        background: 'linear-gradient(135deg, #fff9f0, #ffffff)',
      }}
    >
      <Stack gap="md">
        <JumboTitle order={2} fz={rem(20)} ta="center" c="#fc8900" style={{ fontWeight: 700 }}>
          Get ahead of approval by providing your ID and business bank statements
        </JumboTitle>

        {step !== 'thankyou' && (
          <div>
            <Stack gap="lg">
              <FileInput
                label="Upload or take photo of the FRONT of your driver's licence"
                placeholder="Choose file or take photo"
                leftSection={<IconUpload size={18} />}
                radius="md"
                withAsterisk
                accept="image/*" // allows gallery or camera
                onChange={(event) => {
                  const selected = Array.isArray(event) ? event[0] : event;
                  setLicenseFront(selected || null);
                  if (selected) setFile((prev) => [...(prev || []), selected]);
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

              <FileInput
                label="Upload or take photo of the BACK of your driver's licence"
                placeholder="Choose file or take photo"
                leftSection={<IconUpload size={18} />}
                radius="md"
                withAsterisk
                accept="image/*"
                onChange={(event) => {
                  const selected = Array.isArray(event) ? event[0] : event;
                  setLicenseBack(selected || null);
                  if (selected) setFile((prev) => [...(prev || []), selected]);
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
              <Tooltip label={licenseFront && licenseBack ? '' : "Please upload your ID first"} display={licenseFront && licenseBack ? 'none' : 'block'}>
                <Button
                  fullWidth
                  radius="md"
                  size="md"
                  style={{
                    backgroundColor: licenseFront && licenseBack ? '#fc8900' : '#ccc',
                    color: 'white',
                    fontWeight: 600,
                  }}
                  loading={loading}
                  loaderProps={{ type: 'oval'}}
                  onClick={handleIlionClick}
                  styles={{
                    label: {
                      whiteSpace: 'normal',
                      lineHeight: 1.25,
                      textAlign: 'center',
                    },
                  }}
                  disabled={!licenseFront || !licenseBack}
                >
                  Provide your bank statements through Illion
              </Button>
              </Tooltip>

              <Group gap="xs" justify="center">
                <Button
                  fullWidth
                  radius="md"
                  size="md"
                  variant="outline"
                  color="dark"
                  onClick={handleUploadClick}
                  loading={loading}
                  loaderProps={{ type: 'oval'}}
                  styles={{
                    label: {
                      whiteSpace: 'normal',
                      lineHeight: 1.25,
                      textAlign: 'center',
                    },
                  }}
                >
                  {file
                    ? 'Submit Application'
                    : 'No thanks, continue without uploading'}
                </Button>
                <Text size="xs" c="dimmed" ta="center">
                  {file && file.length > 0
                    ? 'You will need to provide your bank statements later'
                    : 'You will need to provide your ID and bank statements later'}
                </Text>
              </Group>
            </Stack>
          </div>
        )}

        {step === 'thankyou' && (
          <div>
            <Text ta="center" size="lg" fw={600} c="green">
              Thanks for submitting your details. We'll be in touch soon!
            </Text>
            <Text ta="center" size="sm" fw={400} c="black">
                Click outside this box to close
            </Text>
          </div>        
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
