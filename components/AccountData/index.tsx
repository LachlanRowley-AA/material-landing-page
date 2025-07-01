'use client';
import { Card, Text, Title, Stack, Divider, Box, Flex } from '@mantine/core';
import { useState, useEffect } from 'react';

type UserAccountProps = {
    userDetails : UserDetails | null;
};

type UserDetails = {
    name: string;
    company: string;
    address: string;
    phoneNumber: string;
    balance: number;
};

const ValueBox = ({
    children,
    color,
}: {
    children: React.ReactNode;
    color?: string;
}) => (
    <Box
        px="sm"
        py="xs"
        mih={40}
        style={{
            border: '1px solid #ced4da',
            borderRadius: '4px',
            backgroundColor: '#f8f9fa',
            color,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
        }}
    >
        {children}
    </Box>
);

export function UserDataDisplay({ userDetails = null }: UserAccountProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Default values for when userDetails is null
    const displayData = {
        name: userDetails?.name || 'N/A',
        businessName: userDetails?.company || 'N/A',
        address: userDetails?.address || 'N/A',
        phoneNumber: userDetails?.phoneNumber || 'N/A',
        balance: userDetails?.balance || 0
    };

    console.log(displayData);

    return (
        <Card radius="md" padding="lg" withBorder m="xl">
            <Stack gap="md">
                <Title order={3}>Account Summary</Title>
                <Divider />
                
                {loading && <Text>Loading user data...</Text>}
                {error && <Text c="red">Error: {error}</Text>}
                {/* {!apiKey && <Text c="dimmed">No API key provided</Text>} */}
                
                <Flex gap="xl" wrap="wrap">
                    <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
                        <Text fw={500}>Name</Text>
                        <ValueBox>{displayData.name}</ValueBox>
                    </Stack>
                    <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
                        <Text fw={500}>Business Name</Text>
                        <ValueBox>{displayData.businessName}</ValueBox>
                    </Stack>
                </Flex>
                
                <Flex gap="xl" wrap="wrap">
                    <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
                        <Text fw={500}>Address</Text>
                        <ValueBox>{displayData.address}</ValueBox>
                    </Stack>
                    <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
                        <Text fw={500}>Phone Number</Text>
                        <ValueBox>{displayData.phoneNumber}</ValueBox>
                    </Stack>
                </Flex>
                
                <Flex>
                    <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
                        <Text fw={500}>Current Balance</Text>
                        <ValueBox>
                            {displayData.balance}
                        </ValueBox>
                    </Stack>
                </Flex>
            </Stack>
        </Card>
    );
}