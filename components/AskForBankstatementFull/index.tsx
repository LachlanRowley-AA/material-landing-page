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
  TextInput,
  Group,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { UserDetails } from '@/lib/UserDetails';

export const AskForBankstatementFull = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'upload' | 'thankyou'>('form');
  const [file, setFile] = useState<File[] | undefined>(undefined);
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
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

  useEffect(() => {
    const savedDetails = sessionStorage.getItem('bankFormUserDetails');
    const savedStep = sessionStorage.getItem('bankFormStep');

    if (savedDetails) {
      setUserDetails(JSON.parse(savedDetails));
    }
    if (savedStep === 'form' || savedStep === 'upload' || savedStep === 'thankyou') {
      setStep(savedStep);
    }
  }, []);

  const handleInputChange = (field: keyof typeof userDetails, value: string) => {
    const updated = { ...userDetails, [field]: value };
    setUserDetails(updated);
    sessionStorage.setItem('bankFormUserDetails', JSON.stringify(updated));
  };

  const handleStepChange = (newStep: typeof step) => {
    setStep(newStep);
    sessionStorage.setItem('bankFormStep', newStep);
  };

  const syncUserToSession = () => {
    const fullName = `${userDetails.firstName} ${userDetails.lastName}`.trim();
    const data: UserDetails = {
      name: fullName,
      company: userDetails.businessName,
      phoneNumber: userDetails.phone,
      email: userDetails.email,
      balance: 0,
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
            industry_id: '62',
            purpose_id: '15',
            product_type_id: '1',
            amount_requested: sessionStorage.getItem('loanAmount') || '-1',
            sales_monthly: '-1',
            company_registration_date: '1444/11/11',
            campaign: 'Test Campaign',
            loan_term_requested: lendTimeframe,
            ...(process.env.LEND_MODE === 'live' && { referrer_person_ref: 'Z2RLL54' }),
          },
          lead_notes: [
            {
              notes: 'referred by Reopay',
            },
          ],
        }),
      });

      if (res.ok) {
        setSuccess('Application submitted successfully');
        setTimeout(() => {
          setSuccess(null);
          handleStepChange('upload');
        }, 1000);
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

  const validateForm = () => {
    const { firstName, lastName, phone, email } = userDetails;
    const phoneRegex = /^[0-9\s\-\+\(\)]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill out all required fields.');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number.');
      return false;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    syncUserToSession();
    sendToLendAPI();
  };

  const handleIlionClick = () => {
    router.push('/bankstatements');
  };

  const handleUploadClick = () => {
    if (file && file.length > 0) {
      const userData = sessionStorage.getItem('userData');
      const parsedUserData: UserDetails = userData ? JSON.parse(userData) : {};
      const formData = new FormData();
      file.forEach((f) => {
        formData.append('invoices', f);
      });
      formData.append('company_name', parsedUserData.company || 'Unknown Company');
      console.log('Uploading files:', formData);
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
            : step === 'upload'
            ? 'Upload your business bank statements'
            : 'Thank you!'}
        </JumboTitle>

        {step === 'form' && (
          <form onSubmit={handleFormSubmit}>
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
                loading={loading}
                type="submit"
              >
                Submit Application
              </Button>
            </Stack>
          </form>
        )}

        {step === 'upload' && (
          <>
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
              styles={{
                label: {
                  whiteSpace: 'normal',
                  lineHeight: 1.25,
                  textAlign: 'center',
                },
              }}
            >
              {file && file.length > 0
                ? 'Upload File(s) and Continue'
                : 'Continue without Uploading'}
            </Button>
          </>
        )}

        {step === 'thankyou' && (
          <Text ta="center" size="lg" fw={600} c="green">
            Thanks for submitting your details. We'll be in touch soon!
          </Text>
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
