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
  TextInput,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { UserDetails } from '@/lib/UserDetails';

export const AskForBankstatementFull = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'upload'>('form');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (field: keyof typeof userDetails, value: string) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  const syncUserToSession = () => {
    const fullName = `${userDetails.firstName} ${userDetails.lastName}`.trim();
    const data: UserDetails = {
      name: fullName,
      company: userDetails.businessName,
      phoneNumber: userDetails.phone,
      email: userDetails.email,
      balance: 0, // Default value, can be updated later
      street: '',
      city: '',
      state: '',
      postCode: '',
      country: '',
      address: '',
    };
    sessionStorage.setItem('userData', JSON.stringify(data));
  };

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
        }),
      });

      if (res.ok) {
        setSuccess('Application submitted successfully');
        setStep('upload');
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

  const handleFormSubmit = () => {
    syncUserToSession();
    sendToLendAPI();
    setStep('upload');
  };

  const handleIlionClick = () => {
    router.push('/bankstatements');
  };

    const handleUploadClick = () => {
      if(file) {
        const userData = sessionStorage.getItem('userData');
        const parsedUserData: UserDetails = userData ? JSON.parse(userData) : {};
        console.log('the file is:', file);
        const formData = new FormData();
        formData.append('invoices', file);
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
      <Stack gap="lg">
        <JumboTitle
          order={2}
          fz={rem(20)}
          ta="center"
          c="#fc8900"
          style={{ fontWeight: 700 }}
        >
          {step === 'form'
            ? 'Let\'s get your details first'
            : 'Upload your business bank statements'}
        </JumboTitle>

        {step === 'form' && (
          <Stack gap="xs">
            <TextInput
              label="First Name"
              placeholder="John"
              value={userDetails.firstName}
              onChange={(e) => handleInputChange('firstName', e.currentTarget.value)}
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              value={userDetails.lastName}
              onChange={(e) => handleInputChange('lastName', e.currentTarget.value)}
              required
            />
            <TextInput
              label="Business Name"
              placeholder="Acme Pty Ltd"
              value={userDetails.businessName}
              onChange={(e) => handleInputChange('businessName', e.currentTarget.value)}
            />
            <TextInput
              label="Phone Number"
              placeholder="0400 000 000"
              value={userDetails.phone}
              onChange={(e) => handleInputChange('phone', e.currentTarget.value)}
              required
            />
            <TextInput
              label="Email"
              placeholder="you@example.com"
              value={userDetails.email}
              onChange={(e) => handleInputChange('email', e.currentTarget.value)}
              required
            />

            <Button
              fullWidth
              radius="md"
              size="md"
              style={{ backgroundColor: '#fc8900', color: 'white', fontWeight: 600 }}
              onClick={handleFormSubmit}
              loading={loading}
            >
              Submit Application
            </Button>
          </Stack>
        )}

        {step === 'upload' && (
          <>
            <FileInput
              label="Upload your bank statements"
              placeholder="Choose file(s)"
              leftSection={<IconUpload size={18} />}
              radius="md"
              withAsterisk
              value={file}
              onChange={(event) => {
                setFile(event as File);
                console.log(event);
                console.log('File selected:', file);
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
              onClick={() => {
                handleUploadClick();
              }}
              styles={{
                label: {
                  whiteSpace: 'normal',
                  lineHeight: 1.25,
                  textAlign: 'center',
                },
              }}
            >
              {file ? 'Upload File and Continue' : 'Continue without Uploading'}
            </Button>
          </>
        )}

        {success && (
          <Notification
            icon={<IconCheck />}
            color="green"
            title="Success"
            onClose={() => setSuccess(null)}
          >
            {success}
          </Notification>
        )}

        {error && (
          <Notification
            icon={<IconX />}
            color="red"
            title="Error"
            onClose={() => setError(null)}
          >
            {error}
          </Notification>
        )}
      </Stack>
    </Card>
  );
};
