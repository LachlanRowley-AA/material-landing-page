'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';
import {
  IconCheck,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconHourglassLow,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import {
  Button,
  Card,
  Divider,
  FileInput,
  Group,
  Notification,
  rem,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { UserDetails } from '@/lib/UserDetails';

export const AskForBankstatementFull = () => {
  const router = useRouter();
  const [file, setFile] = useState<File[] | undefined>(undefined);
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseFrontUpload, setLicenseFrontUpload] = useState<boolean | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  const [licenseBackUpload, setLicenseBackUpload] = useState<boolean | null>(false);
  const [step, setStep] = useState<'form' | 'upload' | 'thankyou'>('form');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
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
    fetchUserIP();
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

    const cancelSend = sessionStorage.getItem('testing');
    if (cancelSend) {
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
    const notes = sessionStorage.getItem('notes') || '';
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
              notes: `referred by eazytrade${notes ? `\n\nNotes: ${notes}` : ''}`,
            },
          ],
        }),
      });
      if (res.ok) {
        setSuccess('Application submitted successfully');
        setSuccess(null);
        handleStepChange('upload');
        return true;
      }
      const text = await res.text();
      let errorMessage = `Submission failed: ${res.status}`;

      try {
        const outer = JSON.parse(text);
        if (outer.body) {
          const inner = JSON.parse(outer.body);
          if (inner.errors) {
            errorMessage = inner.errors[0].error;
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
      return false;
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      return false;
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
    if (!validateForm()) {
      return;
    }
    syncUserToSession();
    sendToLendAPI();
  };

  const handleIlionClick = () => {
    if (loading) {
      return;
    }
    sendGAEvent('event','illionClicked');

    // Open new tab IMMEDIATELY on user click
    const newTab = window.open('/bankstatements', '_blank');

    // If popup was blocked, newTab will be null
    if (!newTab) {
      setError('Please allow pop-ups to open bank statement upload page.');
      return;
    }

    setLoading(true);

    // Proceed with async API logic in the background
    handleUploadClick()
      .then((success) => {
        if (success) {
          handleStepChange('thankyou');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error: ${err.message}`);
        setLoading(false);
      });
  };

  const handleIdUpload = async (spot: string, id: File): Promise<boolean> => {
    setUploading(true);
    try {
      const userData = sessionStorage.getItem('userData');
      const parsedUserData: UserDetails = userData
        ? JSON.parse(userData)
        : setError('userData not found');
      if (!userData) {
        setUploading(false);
        return false;
      }
      const formData = new FormData();
      formData.append('company_name', parsedUserData.company || 'Unknown Company');
      formData.append('spot', spot);
      formData.append('file', id);
      const response = await fetch('/api/uploadIdSingular', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: `Unexpected response format: ${text}` };
      }

      if (data.error) {
        switch (spot) {
          case 'front':
            setLicenseFront(null);
            setLicenseFrontUpload(false);
            break;
          case 'back':
            setLicenseBack(null);
            setLicenseBackUpload(false);
        }
        setError(`There was an issue uploading the ${spot} of your licence. Please try again`);
        setUploading(false);
        return false;
      }
      switch (spot) {
        case 'front':
          setLicenseFrontUpload(true);
          break;
        case 'back':
          setLicenseBackUpload(true);
          break;
      }
      setSuccess(`${spot} uploaded successfully`);
      setUploading(false);
      return true;
    } catch (err: any) {
      setError(`Error upload ${spot}: ${err.message}`);
      setUploading(false);
      return false;
    }
  };

  const handleUploadClick = async (): Promise<boolean> => {
    if (loading) {
      return false;
    }
    if ((licenseFront && !licenseFrontUpload) || (licenseBack && !licenseBackUpload)) {
      return false;
    } //don't submit until uploads are done
    setLoading(true);
    const userData = sessionStorage.getItem('userData');
    const parsedUserData: UserDetails = userData ? JSON.parse(userData) : {};
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    try {
      const privacyRes = await fetch(`/api/generate_privacy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: parsedUserData.name,
          ip,
          date: formattedDate,
          fileName: `${parsedUserData.company}-privacy-form.pdf`,
          folder: `${parsedUserData.company}`,
        }),
      });
      const contentType = privacyRes.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await privacyRes.json();
      } else {
        const text = await privacyRes.text();
        data = { error: `Unexpected response format: ${text}` };
      }
      console.log(data);

      setSuccess(`Submission successful`);
      return true;
    } catch (err: any) {
      setError(`Failed to upload privacy form ${err.message}`);
      setLoading(false);
      return false;
    }
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
        setIp('192.168.1.1');
        throw new Error('Invalid IP response');
      }

      setIp(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      setIp('IP_FETCH_FAILED');
    }
  }, []);

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
        <JumboTitle order={2} fz={rem(20)} ta="center" c="#fc8900" style={{ fontWeight: 700 }}>
          {step === 'form'
            ? "Let's get your details first"
            : step === 'upload'
              ? 'Get ahead of approval by providing your ID and business bank statements'
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
                placeholder="Abc Pty Ltd"
                value={userDetails.businessName}
                onChange={(e) => handleInputChange('businessName', e.currentTarget.value)}
                required
              />
              <TextInput
                label="Phone Number"
                placeholder="0400000000"
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
                loaderProps={{ type: 'oval' }}
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
              label="Upload or take a photo of the FRONT of your driver's licence"
              placeholder="Choose a file or take a photo"
              leftSection={<IconUpload size={18} />}
              rightSection={
                licenseFrontUpload ? <IconCircleCheckFilled size={18} color="green" /> : ''
              }
              radius="md"
              withAsterisk
              accept="image/jpeg, image/png" // allows gallery or camera
              onChange={async (event) => {
                const selected = Array.isArray(event) ? event[0] : event;
                setLicenseFront(selected || null);
                setLicenseFrontUpload(null);
                await handleIdUpload('front', selected);
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
              placeholder="Choose a file or take a photo"
              leftSection={<IconUpload size={18} />}
              rightSection={
                licenseBackUpload ? <IconCircleCheckFilled size={18} color="green" /> : ''
              }
              radius="md"
              withAsterisk
              accept="image/jpeg, image/png"
              onChange={async (event) => {
                const selected = Array.isArray(event) ? event[0] : event;
                setLicenseBack(selected || null);
                setLicenseBackUpload(null);
                handleIdUpload('back', selected);
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
            <Tooltip
              label={licenseFront && licenseBack ? '' : 'Please upload your ID first'}
              display={licenseFront && licenseBack ? 'none' : 'block'}
            >
              <Button
                fullWidth
                radius="md"
                size="md"
                style={{
                  backgroundColor: licenseFrontUpload && licenseBackUpload ? '#fc8900' : '#ccc',
                  color: 'white',
                  fontWeight: 600,
                }}
                loading={loading}
                loaderProps={{ type: 'oval' }}
                onClick={handleIlionClick}
                styles={{
                  label: {
                    whiteSpace: 'normal',
                    lineHeight: 1.25,
                    textAlign: 'center',
                  },
                }}
                disabled={!licenseFrontUpload || !licenseBackUpload}
              >
                Provide your bank statements through Illion (credit score safe)
              </Button>
            </Tooltip>

            <Button
              fullWidth
              radius="md"
              size="md"
              variant="outline"
              color="dark"
              onClick={async () => {
                sendGAEvent('event','illionSkipped');
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
              disabled={
                !!licenseBack && !!licenseFront && (!licenseFrontUpload || !licenseBackUpload)
              }
            >
              {licenseBack && licenseFront
                ? licenseBackUpload && licenseFrontUpload
                  ? 'Submit without bank statements'
                  : 'Uploading your ID'
                : 'No thanks, continue without uploading'}
            </Button>
            <Text size="xs" ta="center" fw={550}>
              {licenseFrontUpload && licenseBackUpload
                ? 'You will need to provide your bank statements later'
                : 'You will need to provide your ID and bank statements later'}
            </Text>
          </>
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
              <Link
                href="/bankstatements"
                target="_blank"
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                Click here.
              </Link>
            </Text>
          </div>
        )}

        {uploading && (
          <Notification
            icon={<IconHourglassLow />}
            color="green"
            title="Success"
            onClose={() => setSuccess(null)}
          >
            Uploading your Id
          </Notification>
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
          <Notification icon={<IconX />} color="red" title="Error" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}
      </Stack>
    </Card>
  );
};
