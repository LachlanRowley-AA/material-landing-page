'use client';

import { useState } from 'react';
import {
  Box,
  Flex,
  Stack,
  Text,
  Title,
  rem,
  ScrollArea,
  Group,
  ActionIcon,
  Image,
  Tooltip,
  Card,
  Button
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX, IconTrash, IconFileTypePdf } from '@tabler/icons-react';
import { createClient } from '@supabase/supabase-js';

// const supabase = createClient("https://hfsysehrdshrbtmjsgcx.supabase.co")

export function UploadInvoice() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Add files, avoiding duplicates by name + size
  const handleDrop = (files: File[]) => {
    setUploadedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const newFiles = files.filter((f) => !existing.has(f.name + f.size));
      return [...prev, ...newFiles];
    });
  };

  // Remove file by index
  const handleRemove = (index: number) => {
    setUploadedFiles((files) => files.filter((_, i) => i !== index));
  };

  // Check if file is an image
  const isImage = (file: File) => file.type.startsWith('image/');

  // Check if file is PDF
  const isPdf = (file: File) => file.type === 'application/pdf';

  // const handleSubmit = async () => {
  //   try {

  //   }
  // }

  return (
    <Card radius="md" padding="lg" withBorder m="xl">
    <Flex w="100%" px="xl">
      {/* Primary Content Area (File Previews) */}
      <Box style={{ flex: 1, backgroundColor: '#f8f9fa', border: '4px', borderColor: 'black' }} p="lg">
        <Title order={3} mb="sm">
          Uploaded Invoices
        </Title>

        {uploadedFiles.length === 0 ? (
          <Text c="dimmed">No invoices uploaded yet.</Text>
        ) : (
          <ScrollArea h="100%" type="auto" pr="md">
            <Stack gap="sm">
              {uploadedFiles.map((file, index) => {
                const fileURL = URL.createObjectURL(file);

                return (
                  <Group
                    key={`${file.name}-${file.size}`}
                    style={{
                      background: 'white',
                      padding: rem(8),
                      borderRadius: rem(6),
                      boxShadow:
                        '0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(fileURL, '_blank')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        window.open(fileURL, '_blank');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Preview */}
                    <Box
                      sx={{
                        width: rem(60),
                        height: rem(60),
                        borderRadius: rem(4),
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        flexShrink: 0,
                      }}
                    >
                      {isImage(file) ? (
                        <Image
                          src={fileURL}
                          alt={file.name}
                          fit="contain"
                          style={{ maxHeight: rem(60), maxWidth: rem(60) }}
                          withPlaceholder
                        />
                      ) : isPdf(file) ? (
                        <IconFileTypePdf size={rem(40)} color="#E02F2F" />
                      ) : (
                        <IconFile size={rem(40)} />
                      )}
                    </Box>

                    {/* File info */}
                    <Box style={{ flex: 1, overflow: 'hidden' }}>
                      <Text
                        size="sm"
                        weight={500}
                        lineClamp={1}
                        sx={{ userSelect: 'none' }}
                      >
                        {file.name}
                      </Text>
                      <Text size="xs" color="dimmed" sx={{ userSelect: 'none' }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </Text>
                    </Box>

                    {/* Delete button */}
                    <Tooltip label="Remove file" withArrow>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(index);
                        }}
                        aria-label={`Remove ${file.name}`}
                      >
                        <IconTrash size={rem(18)} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                );
              })}
            </Stack>
          </ScrollArea>
        )}
      </Box>

      {/* Sidebar Upload Area */}
      <Box
        w={rem(320)}
        p="lg"
        bg="white"
        style={{ borderLeft: '1px solid #dee2e6' }}
      >
        <Stack>
          <Title order={4}>Upload Invoices</Title>
          <Text size="sm" c="dimmed">
            Drag and drop your invoice files here, or click to select them.
          </Text>

          <Dropzone
            onDrop={handleDrop}
            onReject={(files) => console.warn('Rejected files', files)}
            maxSize={5 * 1024 ** 2}
            accept={[MIME_TYPES.pdf, MIME_TYPES.png, MIME_TYPES.jpeg]}
            h={rem(200)}
            radius="md"
            multiple
          >
            <Flex
              justify="center"
              align="center"
              direction="column"
              style={{ height: '100%' }}
              gap="sm"
            >
              <Dropzone.Accept>
                <IconUpload size={rem(40)} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={rem(40)} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconFile size={rem(40)} stroke={1.5} />
              </Dropzone.Idle>
              <Text size="sm">Drop files here or click to upload</Text>
            </Flex>
          </Dropzone>
        </Stack>
      </Box>
      <Button>
        Upload files
      </Button>
    </Flex>
    </Card>
  );
}
