'use client';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Text,
  Title,
  Stack,
  Divider,
  Box,
  Flex,
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { UserDetails } from '@/lib/UserDetails';
import { IconEdit } from '@tabler/icons-react';
import { useUnsavedChanges } from '@/components/unsavedChanges';

type ValueBoxProps = {
  children: string;
  editable?: boolean;
  onChange?: (value: string) => void;
};

export const ValueBox = ({ children, editable = false, onChange }: ValueBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !editable) {
      ref.current.innerText = children;
    }
  }, [children, editable]);

  const handleBlur = () => {
    if (ref.current && onChange) {
      onChange(ref.current.innerText.trim());
    }
  };

  return (
    <Box
      px="sm"
      py="xs"
      mih={40}
      style={{
        border: '1px solid #ced4da',
        borderRadius: '4px',
        backgroundColor: editable ? '#fff' : '#f8f9fa',
        color: '#212529',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        cursor: editable ? 'text' : 'default',
      }}
    >
      <div
        ref={ref}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={handleBlur}
        style={{ flex: 1, outline: 'none' }}
      >
        {children}
      </div>
    </Box>
  );
};

type UserAccountProps = {
  userDetails: UserDetails | null;
};

export function UserDataDisplay({ userDetails = null }: UserAccountProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const address = [
    userDetails?.street,
    userDetails?.city,
    userDetails?.state,
    userDetails?.postCode,
    userDetails?.country
  ]
  .filter(Boolean)
  .join(', ');

  const [displayData, setDisplayData] = useState({
    name: userDetails?.name || 'N/A',
    businessName: userDetails?.company || 'N/A',
    address: address || 'N/A',
    phoneNumber: userDetails?.phoneNumber || 'N/A',
    balance: userDetails?.balance || 0,
  });

const setEditable = (val: boolean) => {
  setIsEditable(val);

  if (!val && userDetails) {
    const addressParts = displayData?.address?.split(',').map(part => part.trim()) || [];

    const updatedUserDetails: UserDetails = {
      ...userDetails,
      name: displayData.name,
      company: displayData.businessName,
      email: userDetails.email || '',
      address: displayData.address,
      street: addressParts[0] || '',
      city: addressParts[1] || '',
      state: addressParts[2] || '',
      postCode: addressParts[3] || '',
      country: addressParts[4] || '',
      phoneNumber: displayData.phoneNumber,
      balance: parseFloat(
        displayData.balance.toString().replace(/[^0-9.-]+/g, '')
      ),
    };

    sessionStorage.setItem('userData', JSON.stringify(updatedUserDetails));
  }
};
  const { unsavedChanges, setUnsavedChanges } = useUnsavedChanges();

  const undoChanges = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setDisplayData({
      name: userData.name || 'N/A',
      businessName: userData.company || 'N/A',
      address: userData.address || 'N/A',
      phoneNumber: userData.phoneNumber || 'N/A',
      balance: userData.balance || 0,
    });
    setUnsavedChanges(false);
  };

  function cleanDollarAmount(input: string | number): string {
  // Keep only digits and dots
  const raw = input.toString().replace(/[^0-9.]/g, '');

  // Extract first valid number (ignore others if multiple dots)
  const match = raw.match(/[0-9]*\.?[0-9]*/);
  const num = match ? match[0] : '0';

  // Convert to float then fix to 2 decimals
  const float = parseFloat(num);
  if (isNaN(float)){ return '$0.00'};

  return `$${float.toFixed(2)}`;
}

  return (
    <Card radius="md" padding="lg" withBorder m="xl">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3}>Account Summary</Title>
          <Group>
            <Button
              onClick={() => {
                undoChanges();
                setUnsavedChanges(false);
                setEditable(!isEditable);
            }}
                
              style={{ display: unsavedChanges ? 'block' : 'none' }}
            >
              Undo Changes
            </Button>
            <Button
              onClick={() => {
                setEditable(!isEditable);
                
                setUnsavedChanges(false);
              }}
              leftSection={<IconEdit size={20} color={isEditable ? 'black' : 'white'} />}
            >
              {isEditable ? 'Save Changes' : 'Edit Details'}
            </Button>
          </Group>
        </Group>
        <Divider />

        {loading && <Text>Loading user data...</Text>}
        {error && <Text c="red">Error: {error}</Text>}

        <Flex gap="xl" wrap="wrap">
          <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
            <Text fw={500}>Name</Text>
            <ValueBox
              editable={isEditable}
              onChange={(val) => {
                setUnsavedChanges(true);
                if (val.trim() !== '') {
                  setDisplayData((prev) => ({ ...prev, name: val }));
                }
              }}
            >
              {displayData.name}
            </ValueBox>
          </Stack>
          <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
            <Text fw={500}>Business Name</Text>
            <ValueBox
              editable={isEditable}
              onChange={(val) => {
                setUnsavedChanges(true);
                if (val.trim() !== '') {
                  setDisplayData((prev) => ({ ...prev, businessName: val }));
                }
              }}
            >
              {displayData.businessName}
            </ValueBox>
          </Stack>
        </Flex>

        <Flex gap="xl" wrap="wrap">
          <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
            <Text fw={500}>Address</Text>
            <ValueBox
              editable={isEditable}
              onChange={(val) => {
                setUnsavedChanges(true);
                if (val.trim() !== '') {
                  setDisplayData((prev) => ({ ...prev, address: val }));
                }
              }}
            >
              {displayData.address}
            </ValueBox>
          </Stack>
          <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
            <Text fw={500}>Phone Number</Text>
            <ValueBox
              editable={isEditable}
              onChange={(val) => {
                setUnsavedChanges(true);
                if (val.trim() !== '') {
                  setDisplayData((prev) => ({ ...prev, phoneNumber: val }));
                }
              }}
            >
              {displayData.phoneNumber}
            </ValueBox>
          </Stack>
        </Flex>

        <Flex>
          <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
            <Text fw={500}>Current Balance</Text>
            <ValueBox
              editable={false}
              onChange={(val) => {
                setUnsavedChanges(true);
                if (val.trim() !== '') {
                setDisplayData((prev) => ({ ...prev, balance: cleanDollarAmount(val) }));
               }
              }}
            >
              {typeof displayData.balance === 'number'
                ? displayData.balance.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                  })
                : displayData.balance}
            </ValueBox>
          </Stack>
        </Flex>

        {unsavedChanges && (
          <div>
          <Text c="red" size="sm">
            You have unsaved changes!
          </Text>
          <Button
              hiddenFrom="md"
              onClick={() => {
              setEditable(!isEditable);
              
              setUnsavedChanges(false);
            }}
            leftSection={<IconEdit size={20}/>}
          >
            Save Changes
          </Button>
          </div>
        )}
      </Stack>
    </Card>
  );
}
