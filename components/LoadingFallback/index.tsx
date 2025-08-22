'use client';
import { Center, Loader, Text, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';

export function LoadingFallback() {
  const [currentValue, setCurrentValue] = useState(0);
  const maxValue = 100;
  const duration = 5000; // 5 seconds
  const intervalTime = 100; // ms

  useEffect(() => {
    console.log('LoadingFallback mounted at:', new Date().toISOString());
    const step = (maxValue / duration) * intervalTime;
    console.log('Calculated step:', step); // Should be 2
    
    const interval = setInterval(() => {
      setCurrentValue((prev) => {
        const next = prev + step;
        console.log(`Progress: ${prev} -> ${next} (${Math.round(next)}%)`);
        return next >= maxValue ? maxValue : next;
      });
    }, intervalTime);

    return () => {
      console.log('LoadingFallback unmounting at:', new Date().toISOString());
      clearInterval(interval);
    };
  }, []);

  // Add a console.log to see if render is being called
  console.log('LoadingFallback rendering with currentValue:', currentValue);

  return (
    <Center style={{ height: '100vh' }}>
      <Stack gap="xs">
        <Loader />
        <Text ta="center">Loading your account data...</Text>
        <Text ta="center">{Math.round(currentValue)}%</Text>
      </Stack>
    </Center>
  );
}