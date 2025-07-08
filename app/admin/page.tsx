'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Box,
  Loader,
  TextInput,
  Card,
  Badge,
  Grid,
  FileInput,
  Progress,
  Alert,
  Avatar,
  ActionIcon,
  ThemeIcon,
  SimpleGrid,
  Image,
  rem,
  Flex,

} from '@mantine/core';
import {
  IconQrcode,
  IconDownload,
  IconUpload,
  IconUser,
  IconMail,
  IconLogout,
  IconPhoto,
  IconCheck,
  IconAlertCircle,
  IconHistory,
  IconCloudUpload,
  IconRefresh,
  IconPhotoSearch,
  IconKey,
  IconWorld
} from '@tabler/icons-react';

import { v4 as uuidv4} from 'uuid';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState<string[]>([]);
  
  // QR Code states
  const [customerName, setcustomerName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [customerPass, setcustomerPass] = useState('');
  const [generatedQrCodes, setGeneratedQrCodes] = useState<Array<{
    customerName: string;
    url: string;
    timestamp: string;
    pass: string;
  }>>([]);
  const [companyNames, setCompanyNames] = useState<string[]>([])

  const { Canvas } = useQRCode();

  // Function to add green border to QR code canvas
  const addBorderToCanvas = (canvas: HTMLCanvasElement, borderWidth: number = 10, borderColor: string = '#01E194') => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('ctx error');
      return;
    };

    // Get the original image data
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Create new canvas with border
    const newWidth = canvas.width + (borderWidth * 2);
    const newHeight = canvas.height + (borderWidth * 2);
    
    // Resize the canvas
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Fill with border color
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, newWidth, newHeight);
    
    // Put the original QR code in the center
    ctx.putImageData(originalImageData, borderWidth, borderWidth);
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Updated getImage function with better error handling


  // Load images on component mount (with error handling)
  useEffect(() => {
    if (session) {
      // Don't block the UI if image loading fails
    }
  }, [session]);


  const generateQRCode = () => {
    if (!customerName.trim()) {
      return;
    }
    // Create the URL with customer name and tracking data
    const baseUrl = 'localhost:3000/prefill?accountKey=';
    const trackingParams = new URLSearchParams({
      utm_source: 'invoice',
      utm_medium: 'qr',
      utm_campaign: 'eazypay',
    });
    const pw = uuidv4();
    setcustomerPass(pw);
    
    const fullUrl = `${baseUrl}${pw}&${trackingParams.toString()}`;
    setQrCodeUrl(fullUrl);

    // Add to generated QR codes list
    const newQrCode = {
      customerName: customerName,
      url: fullUrl,
      timestamp: new Date().toLocaleString(),
      pass: pw
    };
    
    setGeneratedQrCodes(prev => [newQrCode, ...prev]);
  };

const downloadQRCode = (customerName: string) => {
  // Find the canvas element in the DOM - the useQRCode Canvas component renders a canvas
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  
  if (canvas) {
    // Create a copy of the canvas to avoid modifying the original
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      console.log('Could not get canvas context');
      return;
    }
    
    // Copy the original canvas content
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    // Add border to the copy
    addBorderToCanvas(tempCanvas, 10, '#01E194');
    
    // Download the modified canvas
    const link = document.createElement('a');
    link.download = `qr-code-${customerName.replace(/\s+/g, '_')}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
  } else {
    console.log('QR Code canvas not found');
  }
};

// Levenshtein Distance (basic string similarity)
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function getClosestMatch(name: string, list: string[]): string | null {
  let closest = null;
  let minDistance = Infinity;

  for (const item of list) {
    const dist = getLevenshteinDistance(name, item);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  // Only return if it's not too far off
  return minDistance <= 5 ? closest : null;
}

const uploadQr = async (customerName: string) => {
  try {
    let names: string[] = companyNames;

    // Cache company names if not already loaded
    if (companyNames.length === 0) {
      const res = await fetch('/api/getSheetNames');
      const json = await res.json();
      if (!json?.data || !Array.isArray(json.data)) {
        throw new Error('Invalid response from /api/getSheetNames');
      }
      names = json.data;
      setCompanyNames(names);
    }

    let matched = names.includes(customerName);

    // If not matched, try re-fetching
    if (!matched) {
      const res = await fetch('/api/getSheetNames');
      const json = await res.json();
      if (!json?.data || !Array.isArray(json.data)) {
        throw new Error('Invalid response from /api/getSheetNames');
      }
      names = json.data;
      setCompanyNames(names);
      matched = names.includes(customerName);
    }

    if (!matched) {
      const suggestion = getClosestMatch(customerName, names);
      const message = `Customer name "${customerName}" not found in company list.` +
        (suggestion ? ` Did you mean "${suggestion}"?` : '');
      throw new Error(message);
    }

    // Get the canvas and convert to blob
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('QR Code canvas not found');
    }

    // Create FormData and send
    // We don't actually pass the QR as excel can't handle image upload
    // Instead the API will call an online API service to generate QR codes
    const formData = new FormData();
    formData.append('customerName', customerName);
    formData.append('pw', customerPass); // Include the password

    console.log('Uploading QR code for:', customerName);
    
    const uploadRes = await fetch('/api/uploadQr', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json();
      throw new Error(errorData.error || `Upload failed with status ${uploadRes.status}`);
    }

    const result = await uploadRes.json();
    console.log('QR uploaded successfully:', result);
    
    // Show success message to user
    setUploadStatus(`QR code uploaded successfully for ${customerName}!`);
    
  } catch (error) {
    console.error('Upload error:', error);
    setUploadStatus(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

  const clearQRCode = () => {
    setcustomerName('');
    setQrCodeUrl('');
    setcustomerPass('');
  };

  

  if (status === 'loading') {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Stack align="center" gap="md">
          <Loader size="lg" color="white" type="dots" />
          <Text size="lg" c="white" fw={500}>
            Loading dashboard...
          </Text>
        </Stack>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text size="lg" c="white" fw={500}>
          Redirecting to login...
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p={{ base: '0px', md: 'md'}}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Container size="" p={{ base: "0px", md: "sm" }}>
        <Stack gap="xl">
          {/* Header */}
          <Paper
            p="xl"
            radius="lg"
            shadow="sm"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Group justify="space-between" align="center">
              <Group>
                <Avatar
                  src={session.user?.image}
                  size="lg"
                  radius="xl"
                  style={{ border: '3px solid rgba(255, 255, 255, 0.3)' }}
                />
                <Stack gap="xs">
                  <Title order={1} size="h2" c="white">
                    Admin Dashboard
                  </Title>
                  <Group gap="xs">
                    <IconUser size={16} />
                    <Text size="sm" c="white" opacity={0.9}>
                      {session.user?.name}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconMail size={16} />
                    <Text size="xs" c="white" opacity={0.7}>
                      {session.user?.email}
                    </Text>
                  </Group>
                </Stack>
              </Group>
              
              <Button
                leftSection={<IconLogout size={18} />}
                variant="white"
                color="red"
                size="md"
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              >
                Sign Out
              </Button>
            </Group>
          </Paper>

          {/* QR Code Generator Section */}
          <Paper p={{base:"xs", md:"md"}} radius="lg" shadow="sm">
            <Stack gap="lg">
              <Card
                withBorder
                p="lg"
                radius="md"
                style={{
                  background: 'linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 100%)',
                  border: '2px dashed #10b981'
                }}
              >
                <Stack gap="md">
                  <TextInput
                    label="Customer Name"
                    placeholder="Enter customer name..."
                    value={customerName}
                    onChange={(e) => setcustomerName(e.currentTarget.value)}
                    leftSection={<IconQrcode size={16} />}
                    size="md"
                    radius="md"
                  />
                  
                  <Group>
                    <Button
                      onClick={generateQRCode}
                      disabled={!customerName.trim()}
                      variant="gradient"
                      gradient={{ from: 'teal', to: 'green' }}
                      leftSection={<IconQrcode size={16} />}
                      size="md"
                    >
                      Generate QR Code
                    </Button>
                    <Button
                      onClick={clearQRCode}
                      variant="light"
                      color="gray"
                      leftSection={<IconRefresh size={16} />}
                      size="md"
                    >
                      Clear
                    </Button>
                  </Group>

                  {qrCodeUrl && (
                    <Card withBorder p="lg" bg="white" mt="md">
                      <Title order={4} mb="md">
                        Generated QR Code
                      </Title>
                      <Grid>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                          <Box style={{ textAlign: 'center' }}>
                            <Canvas
                              key={`qr-${customerName.replace(/\s+/g, '_')}`}
                              text={qrCodeUrl}
                              options={{
                                width: 200,
                                margin: 2,
                                color: {
                                  dark: '#000000',
                                  light: '#FFFFFF',
                                },
                              }}
                            />
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 8 }}>
                          <Stack gap="sm">
                            <Group>
                              <Badge variant="light" color="green" size="lg">
                                {customerName}
                              </Badge>
                            </Group>
                            <Group>
                              <IconWorld />
                              <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                                {qrCodeUrl}
                              </Text>
                            </Group>
                            <Group>
                              <IconKey />
                              <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                                {customerPass}
                              </Text>
                            </Group>
                            <Button
                              onClick={() => downloadQRCode(customerName)}
                              variant="filled"
                              color="green"
                              leftSection={<IconDownload size={16} />}
                              size="sm"
                              mt="md"
                            >
                              Download QR Code
                            </Button>
                            <Button
                              onClick={() => uploadQr(customerName)}
                              variant="filled"
                              color="blue"
                              leftSection={<IconUpload size={16} />}
                              size="sm"
                              mt="md"
                            >
                              Uploaded QR Code and password
                            </Button>
                          </Stack>
                        </Grid.Col>
                      </Grid>
                    </Card>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Paper>

          {/* QR Code History */}
          {generatedQrCodes.length > 0 && (
            <Paper p="xl" radius="lg" shadow="sm">
              <Group mb="lg">
                <ThemeIcon size="xl" variant="light" color="blue">
                  <IconHistory size={24} />
                </ThemeIcon>
                <Stack gap="xs">
                  <Title order={2} size="h3">
                    QR Code History
                  </Title>
                  <Text c="dimmed" size="sm">
                    Recently generated QR codes
                  </Text>
                </Stack>
              </Group>

              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {generatedQrCodes.slice(0, 6).map((qr, index) => (
                  <Card key={index} withBorder p="md" radius="md">
                    <Group justify="space-between" mb="sm">
                      <Text fw={500} truncate>
                        {qr.customerName}
                      </Text>
                      <Badge variant="light" size="xs">
                        {qr.timestamp.split(' ')[0].substring(0, 10)}
                      </Badge>
                      <Group>
                        <IconKey />
                        <Text fw={500} truncate>
                          {qr.pass}
                        </Text>
                      </Group>
                    </Group>
                    
                    <Flex justify="space-between" align="center">
                      <Canvas
                        text={qr.url}
                        options={{
                          width: 60,
                          margin: 1,
                          color: {
                            dark: '#000000',
                            light: '#FFFFFF',
                          },
                        }}
                      />
                      <Group>
                        <ActionIcon
                          variant="filled"
                          color="green"
                          size="lg"
                          onClick={() => downloadQRCode(qr.customerName)}
                        >
                          <IconDownload size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="filled"
                          color="blue"
                          size="lg"
                          onClick={() => uploadQr(qr.customerName)}
                        >
                          <IconUpload size={16} />
                        </ActionIcon>
                      </Group>
                    </Flex>
                  </Card>
                ))}
              </SimpleGrid>
            </Paper>
          )}

        </Stack>
      </Container>
    </Box>
  );
}