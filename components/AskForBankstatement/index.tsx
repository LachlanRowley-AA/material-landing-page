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
import Link from 'next/link'

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

    const cancelSend = sessionStorage.getItem('testing');
    if(cancelSend) {
      setLoading(false);
      return true;
    }

    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      setError('User data not found in session storage.');
      setLoading(false);
      return false;
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
            email: parsedUserData.email || 'missingEmail@email.com',
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
        return true;
      }
      const text = await res.text();
      let errorMessage = `Submission failed: ${res.status}`;

      try {
        const outer = JSON.parse(text);
        if (outer.body) {
          const inner = JSON.parse(outer.body);
          if (inner.errors) {
            errorMessage = inner.errors[0].error
          }
          if (inner.error) {
            errorMessage = inner.error;
          }
        }
      } catch {
        // fallback to raw response text
        errorMessage = text;
      }

      setError(errorMessage);
      return false;    }
  catch (err: any) {
      setError(`Error: ${err.message}`);
      return false;
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

  const [ip, setIp] = useState<string | null>('0.0.0.0');
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


const handleUploadClick = async (): Promise<boolean> => {
  if(loading) {return false};
  setLoading(true);
  let apiSuccess = false;
  try {
      apiSuccess = await sendToLendAPI(); // Ensure Lend API call completes before continuing
    } catch (err: any) {
      setError(`Lend API error: ${err.message || 'Unknown error'}`);
      setLoading(false);
      return false;
  }
  if(!apiSuccess) {
    return false;
  }
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

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    formData.append('date', formattedDate);

    try {
      const response = await fetch('/api/uploadBank', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return false;
      }
      setSuccess('Files uploaded successfully');
      return true;
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
      setError(`We had an issue geting your Id. Don't worry, we have recieved your application and will be in touch soon.`)
      return false;
    }
  } else {
    // no files uploaded
    return true;
  }
};

  const handleIlionClick = () => {
    if (loading) return;

    // Open new tab IMMEDIATELY on user click
    const newTab = window.open('/bankstatements', '_blank');

    // If popup was blocked, newTab will be null
    if (!newTab) {
      setError('Please allow pop-ups to open bank statement upload page.');
      return;
    }

    setLoading(true);

    // Proceed with async API logic in the background
    handleUploadClick().then((success) => {
      if (success) {
        handleStepChange('thankyou');
      }
      setLoading(false);
    }).catch((err) => {
      setError(`Error: ${err.message}`);
      setLoading(false);
    });
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
        {step !== 'thankyou' && (
          <div>
            <Stack gap="lg">
            <JumboTitle order={2} fz={rem(20)} ta="center" c="#fc8900" style={{ fontWeight: 700 }}>
              Get ahead of approval by providing your ID and business bank statements
            </JumboTitle>
              <FileInput
                label="Upload or take a photo of the FRONT of your driver's licence"
                placeholder="Choose file or take photo"
                leftSection={<IconUpload size={18} />}
                radius="md"
                withAsterisk
                accept="image/jpeg, image/png" // allows gallery or camera
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
                label="Upload or take a photo of the BACK of your driver's licence"
                placeholder="Choose file or take photo"
                leftSection={<IconUpload size={18} />}
                radius="md"
                withAsterisk
                accept="image/jpeg, image/png"
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
              <Group gap="xs" justify="center">
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
                    Provide your bank statements through Illion (credit score safe)
                </Button>
                </Tooltip>
              </Group>

              <Group gap="xs" justify="center">
               <Button
                fullWidth
                radius="md"
                size="md"
                variant="outline"
                color="dark"
                onClick={async () => {
                  const success = await handleUploadClick();
                  if (success) {
                    handleStepChange('thankyou');
                  }
                }}
                loading={loading}
                loaderProps={{ type: 'oval' }}
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
            <Text size="sm" mt="md" ta="center">
              Need to upload your bank statements?{' '}
              <Link href="/bankstatements" target="_blank" style={{ color: 'blue', textDecoration: 'underline' }}>
                Click here.
              </Link>
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
