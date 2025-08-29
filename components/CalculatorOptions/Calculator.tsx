'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  IconArrowUp,
  IconCashOff,
  IconCheck,
  IconCircleCheck,
  IconCirclePercentageFilled,
  IconClock,
  IconCreditCardPay,
  IconLockOpenOff,
  IconPlus,
  IconRepeat,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import {
  Accordion,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Radio,
  rem,
  SegmentedControl,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { AgreementWidget } from '@/components/AgreementWidget';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';

const DEFAULT_INTEREST_RATE = 13.95;

const MAX_LOAN_AMOUNT = 500000;
const MIN_LOAN_AMOUNT = 5000;

const calculateCustomRepayment = (loanAmount: number, interestRate: number, months: number) => {
  if (loanAmount <= 0) {
    return 0;
  }
  const annualRate = interestRate / 100;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) {
    return loanAmount / months;
  }
  return (
    loanAmount * ((monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
  );
};

const calculateDailyInterest = (loanAmount: number, interestRate: number, days: number) => {
  if (loanAmount <= 0) {
    return 0;
  }
  const dailyRate = interestRate / 100;
  if (dailyRate === 0) {
    return 0;
  }

  return loanAmount * dailyRate * days;
};

const Icon = ({ children }: { children: ReactNode }) => <Center>{children}</Center>;

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useMantineTheme();
  if (active && payload && payload.length) {
    return (
      <Box
        p="sm"
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Text fw="500" c="black">{`${label}`}</Text>
        <Text
          c={theme.colors.secondary[0]}
        >{`Est. Monthly Payment: $${payload[0].value.toLocaleString()}`}</Text>
      </Box>
    );
  }
  return null;
};

type CalculatorProps = {
  startingAmount?: number;
  prefilled?: boolean;
};

export const Calculator = ({ startingAmount = 20000, prefilled = true }: CalculatorProps) => {
  const [baseValue, setBaseValue] = useState(
    startingAmount ? Math.max(Math.min(startingAmount, MAX_LOAN_AMOUNT), MIN_LOAN_AMOUNT) : 10000
  );
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE);
  const [customTimeframe, setCustomTimeframe] = useState('12');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const timeframes = [6, 12, 24, 36];
  const HIGHLIGHT_COLOR = '#FFA500';
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  type Product = {
    minimumAmount?: number;
    key: string;
    title: string;
    items?: { text: string; icon: ReactNode }[];
    terms?: { length: number; rate: number }[];
    layout?: (product: Product) => ReactNode;
    logo?: string;
  };

  const products = [
    {
      minimumAmount: 0,
      logo: '/Sydney Tools/sydney_tools.svg',
      key: 'Sydney Tools Pay',
      title: 'Sydney Tools Pay',
      items: [
        {
          text: 'Interest free for 30 - 60 days',
          icon: <IconCirclePercentageFilled size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Buy now and get between 30 & 60 days interest free',
        reasons: ['You have worked queued up', 'You are waiting for invoices to be paid'],
      },
    },
    {
      minimumAmount: 10000,
      key: 'FlexPay',
      title: 'FlexPay',
      terms: [
        {
          length: 6,
          rate: DEFAULT_INTEREST_RATE,
        },
        {
          length: 12,
          rate: DEFAULT_INTEREST_RATE,
        },
        {
          length: 24,
          rate: DEFAULT_INTEREST_RATE,
        },
        {
          length: 36,
          rate: DEFAULT_INTEREST_RATE,
        },
      ],
      items: [
        {
          text: 'Longer term lengths',
          icon: <IconClock size={18} />,
        },
        {
          text: 'No penalty interest for early payout',
          icon: <IconCashOff size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Enjoy longer term lengths to minimise the impact to your cashflow',
        reasons: ['You need to make a large one-off payment'],
        interest: 'Starting from 13.95% p.a',
      },
      layout: (product: Product) => (
        <Grid px="xs" py="xs" align="center" justify="center">
          <Grid.Col span={12} mb={0}>
            <Text c="black" fz="md" ta="center" fw={600}>
              Select a term length
            </Text>
          </Grid.Col>

          {product.terms &&
            product.terms.length > 0 &&
            product.terms.map((term) => {
              const isSelected = selectedTerm === term.length;

              return (
                <Grid.Col span={{ base: 12, md: 6 }} key={term.length} mb="xs">
                  <Button
                    p={2}
                    w="100%"
                    style={{
                      border: `2px solid ${isSelected ? theme.colors.secondary[0] : '#ccc'}`,
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#46e0d666' : '#f8f3f3ff',
                      transition: 'all 0.3s ease',
                      height: '100%',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTerm(term.length);
                      sessionStorage.setItem('customTimeframe', term.length.toString());
                    }}
                    mb="xs"
                  >
                    <Box w="100%" py={0} my={0}>
                      <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                        {term.length} months
                      </Text>
                      <Text c="black" fz="lg" fw="bold" ta="center" mt={4}>
                        $
                        {calculateCustomRepayment(baseValue, term.rate, term.length).toLocaleString(
                          'en-US',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Text>
                      <Text c="black" fz="xs" ta="center">
                        {isMobile ? 'est.' : 'estimated'} monthly repayment
                      </Text>
                    </Box>
                  </Button>
                </Grid.Col>
              );
            })}
        </Grid>
      ),
    },
    {
      minimumAmount: 10000,
      key: 'RevolvePay',
      title: 'RevolvePay',
      items: [
        {
          text: 'Revolving facility',
          icon: <IconRepeat size={18} />,
        },
        {
          text: 'Payout anytime',
          icon: <IconCreditCardPay size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Set up a revolving line of credit',
        reasons: [
          'You need a payment extension for your account',
          'You need to make frequent purchases',
        ],
        interest: 'Starting from 0.03% per day',
      },
      layout: (product: Product) => (
        <div>
          <Text c="black" fz="md" ta="center" fw="bold" mb={4}>
            Rates starting from 0.03% a day.
          </Text>

          <Flex align="stretch" gap="xs" mb="xs">
            <Box
              w="100%"
              py={0}
              my={0}
              ml={{ base: 'sm', md: 'xl' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: `2px solid ${theme.colors.secondary[0]}`,
                borderRadius: '8px',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Top half */}
              <Box
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
                mt={4}
              >
                <Text fw={600} c="black" fz="sm" ta="center">
                  Principal
                </Text>
              </Box>
              <Box
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                mt={4}
              >
                <Text c="black" fz={{ base: 'md', md: 'lg' }} fw="bold" ta="center">
                  ${baseValue.toLocaleString()}
                </Text>
              </Box>

              {/* Bottom half */}
              <Box
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              />
            </Box>{' '}
            <IconPlus size={48} height="auto" />
            <Box
              w="100%"
              py={0}
              px={1}
              my={0}
              mr={{ base: 'sm', md: 'xl' }}
              h="auto"
              style={{
                border: `2px solid ${theme.colors.secondary[0]}`,
                borderRadius: '8px',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
              }}
            >
              <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                An additional
              </Text>
              <Text c="black" fz={{ base: 'md', md: 'lg' }} fw="bold" ta="center" mt={4}>
                $
                {calculateDailyInterest(baseValue, 0.04, 31).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                / month
              </Text>
              <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                Until principal is paid off
              </Text>
            </Box>
          </Flex>
        </div>
      ),
    },
  ];

  const moreInfo = (
    <Modal
      opened={opened}
      onClose={close}
      size="auto"
      styles={{ content: { background: '#f5f5f5' }, header: { background: '#f5f5f5' } }}
      overlayProps={{
        backgroundOpacity: 0.8,
        c: theme.colors.secondary[0],
        blur: 5,
      }}
    >
      <Title mb="lg" ta="center" order={1} fw={500}>
        Eazytrade Products
      </Title>
      <Grid maw="90vw" w={{ base: '80vw', md: '80vw' }} h={{ base: '70vh', md: '60vh' }}>
        {products.map((product) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={product.key}>
            <Card
              shadow="0 4px 5px rgba(0,0,0,0.1)"
              withBorder
              mx={{ base: 'xs', md: 'lg' }}
              px={{ base: 'xs', md: 'xl' }}
              h="100%"
              radius="md"
            >
              <Text fw={700} mb="md" fz="xl">
                {product.title}
              </Text>
              {product.moreInfo?.desc && <Text mb="sm">{product.moreInfo.desc}</Text>}
              <Accordion
                multiple
                defaultValue={isMobile ? [] : ['features', 'reasons']}
                styles={{
                  label: {
                    fontWeight: 700,
                  },
                  control: {
                    borderTop: '1px solid black',
                    borderBottom: '1px solid black',
                  },
                  root: {
                    height: '100%',
                  },
                }}
              >
                {/* <Accordion.Item key='product' value={product.moreInfo?.reason || ''} /> */}
                <Accordion.Item key="reasons" value="reasons" mb={-2}>
                  <Accordion.Control>Ideal when</Accordion.Control>
                  <Accordion.Panel>
                    {product.moreInfo.reasons.map((reason) => (
                      <Group align="flex-start" key={reason}>
                        <IconCheck color="green" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {reason}
                        </Text>
                      </Group>
                    ))}
                    <div style={{ marginBottom: '40px' }} />
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="features" value="features" mt={0}>
                  <Accordion.Control>Features</Accordion.Control>
                  <Accordion.Panel>
                    {product.items.map((item) => (
                      <Group align="flex-start" key={item.text} mb="xs">
                        <IconCircleCheck color="green" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {item.text}
                        </Text>
                      </Group>
                    ))}
                    {product.moreInfo.interest && (
                      <Group key={product.moreInfo.interest}>
                        <IconCircleCheck color="green" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {product.moreInfo.interest}
                        </Text>
                      </Group>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Flex align="flex-end" justify="center">
                <Button
                  mt="xl"
                  onClick={() => {
                    setSelectedProduct(product.key);
                    sessionStorage.setItem('notes', product.key);
                    close();
                  }}
                >
                  Select
                </Button>
              </Flex>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Modal>
  );

  useEffect(() => {
    if (!sessionStorage.getItem('loanAmount')) {
      sessionStorage.setItem('loanAmount', startingAmount.toString());
    }
    if (!sessionStorage.getItem('customTimeframe')) {
      sessionStorage.setItem('customTimeframe', '12');
    }
  });

  return (
    <Box
      bg="#F2F5F8"
      px={isMobile ? 'xs' : 'xl'}
      py={isMobile ? 'sm' : 'xl'}
      style={{
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Box
        bg="white"
        style={{
          maxWidth: 1600,
          margin: '0 auto',
          borderRadius: '1rem',
          boxShadow: '0 0 12px rgba(0,0,0,0.05)',
        }}
        py="lg"
      >
        <Grid
          gutter={isMobile ? 'sm' : 'xl'}
          my={0}
          mx="0"
          px="0"
          py="sm"
          style={{
            marginTop: '0px',
            paddingTop: '0px',
            minHeight: '100%',
            height: 'auto',
          }}
          overflow="hidden"
          bg="white"
        >
          {/* Left Column */}
          <Grid.Col
            span={isMobile ? 12 : 4}
            pt={isMobile ? 'xs' : 'md'}
            px={isMobile ? 'xs' : 'md'}
            pb={isMobile ? 'md' : 'xl'}
          >
            <Stack align="center" gap="xs" my={isMobile ? 'md' : 'xl'}>
              <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ width: '100%' }}
              >
                <Grid align="center" gutter="xl">
                  <Grid.Col span={12}>
                    <span>
                      <JumboTitle
                        order={3}
                        fz="xs"
                        ta="center"
                        style={{ textWrap: 'balance' }}
                        c={{ base: 'black', md: 'black' }}
                        fw={600}
                      >
                        Set your
                      </JumboTitle>
                      <JumboTitle
                        order={3}
                        fz="xs"
                        ta="center"
                        style={{ textWrap: 'balance' }}
                        c={{ base: '01E194', md: theme.colors.secondary[0] }}
                        fw={600}
                      >
                        Loan Amount
                      </JumboTitle>
                    </span>
                  </Grid.Col>
                </Grid>
              </motion.div>
            </Stack>

            <Container
              size="lg"
              mt="xl"
              ta="center"
              px={isMobile ? 0 : 'md'}
              pb={isMobile ? 'md' : 'xl'}
            >
              <motion.div
                initial={{ opacity: 0.0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Stack gap={isMobile ? 'sm' : 'md'}>
                  <TextInput
                    type="text"
                    value={baseValue.toLocaleString()}
                    onChange={(event) => {
                      const raw = event.currentTarget.value;
                      const parsed = Number(raw.replace(/,/g, ''));

                      if (!isNaN(parsed)) {
                        const capped = Math.min(parsed, MAX_LOAN_AMOUNT);
                        setBaseValue(capped);
                        sessionStorage.setItem('loanAmount', capped.toString());
                      }

                      if (selectedProduct) {
                        const product = products.find((p) => p.key === selectedProduct);
                        if (product && baseValue < (product.minimumAmount || 0)) {
                          setSelectedProduct(null);
                          setSelectedTerm(null);
                          sessionStorage.removeItem('notes');
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

                      // Allow control keys
                      if (allowed.includes(e.key)) {
                        return;
                      }

                      // Allow one dot if not already present
                      if (e.key === '.') {
                        if (e.currentTarget.value.includes('.')) {
                          e.preventDefault(); // prevent multiple dots
                        }
                        return;
                      }

                      // Allow digits 0–9
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault(); // block everything else
                      }
                    }}
                    onBlur={() => {
                      const raw = baseValue.toString();
                      const parsed = Number(raw.replace(/,/g, ''));
                      if (!isNaN(parsed)) {
                        const capped = Math.max(MIN_LOAN_AMOUNT, parsed);
                        setBaseValue(capped);
                        sessionStorage.setItem('loanAmount', capped.toString());
                      }
                    }}
                    leftSection="$"
                    size="xl"
                    styles={{
                      input: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                      label: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                      section: { fontSize: isMobile ? rem(28) : rem(40), color: 'black' },
                    }}
                    ta="center"
                    rightSection={
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => {
                          setBaseValue(Math.min(startingAmount, MAX_LOAN_AMOUNT));
                          sessionStorage.setItem('loanAmount', startingAmount.toString());
                          console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));
                        }}
                      >
                        Reset
                      </Button>
                    }
                    rightSectionWidth={100}
                  />
                  <Stack gap={0}>
                    <Text size="sm" fs="italic">
                      Finance available between $5,000 and $500,000 regardless of outstanding
                      balance
                    </Text>
                    <Slider
                      px="xl"
                      min={MIN_LOAN_AMOUNT}
                      max={MAX_LOAN_AMOUNT}
                      step={1000}
                      value={baseValue}
                      onChange={(value) => {
                        setBaseValue(Math.max(0, value));
                        sessionStorage.setItem('loanAmount', value.toString());
                        console.log('Loan Amount set to:', sessionStorage.getItem('loanAmount'));

                        if (selectedProduct) {
                          const product = products.find((p) => p.key === selectedProduct);
                          if (product && value < (product.minimumAmount || 0)) {
                            setSelectedProduct(null);
                            setSelectedTerm(null);
                            sessionStorage.removeItem('notes');
                          }
                        }
                      }}
                      c={theme.colors.secondary[0]}
                      size="xl"
                      styles={{ markLabel: { color: 'orange' } }}
                    />
                  </Stack>
                </Stack>
              </motion.div>
            </Container>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={isMobile ? 12 : 5} px={0}>
            <Stack gap="xs">
              <JumboTitle
                order={1}
                fz="xs"
                ta="center"
                style={{ textWrap: 'balance' }}
                c="black"
                fw={600}
              >
                Compare and Select Payment Options
              </JumboTitle>

              {products.map((product) => {
                const isSelected = selectedProduct === product.key;
                return (
                  <Card
                    key={product.key}
                    onClick={() => {
                      if (baseValue < (product.minimumAmount || 0)) {
                        return;
                      }
                      setSelectedProduct(product.key);
                      setSelectedTerm(null);
                      sessionStorage.setItem('notes', product.key);
                    }}
                    style={{}}
                    mb={0}
                    pb={0}
                  >
                    <Card
                      key={product.key}
                      style={{
                        border: `1px solid ${isSelected ? HIGHLIGHT_COLOR : theme.colors.secondary[0]}`,
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#FFF3E0' : '#f8f9fa',
                      }}
                      pb={4}
                      pt={0}
                      px={0}
                      mx="lg"
                    >
                      <Flex
                        wrap="wrap"
                        gap="xs"
                        px="md"
                        py="xs"
                        align="center"
                        justify="start"
                        style={{ flex: `1 1 auto`, minWidth: 0 }}
                      >
                        <Group gap={0} align="center" mr="md">
                          <Radio
                            value={product.key}
                            checked={isSelected}
                            readOnly
                            pr="xs"
                            disabled={baseValue < product.minimumAmount}
                          />
                          {/* {product.logo && (<Image src={product.logo || null} w={170} my={-10} py={-10}/>) } */}
                          <Text fw={600} c="black" fz={{ base: 'md', md: 'lg' }} ta="center" pl={0}>
                            {product.title}
                          </Text>
                        </Group>
                        <Flex gap="lg">
                          {product.items?.map((item) => (
                            <Flex key={item.text} align="center" gap={4}>
                              <Icon>{item.icon}</Icon>
                              <Text
                                c="black"
                                fz={{ base: 'xs', md: 'sm' }}
                                fw={600}
                                style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                              >
                                {item.text}
                              </Text>
                            </Flex>
                          ))}
                        </Flex>
                        {baseValue < (product.minimumAmount || 0) && (
                          <Text c="red" fz="sm" fw={600}>
                            Minimum ${product.minimumAmount?.toLocaleString()} required
                          </Text>
                        )}
                      </Flex>

                      {isSelected && product.layout?.(product)}
                    </Card>
                  </Card>
                );
              })}
              <Group justify="right" mx="xl">
                <Button ml="xl" onClick={open}>
                  Learn More
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 3} pt={isMobile ? 'xl' : 'md'} px="xl" pb="xl">
            <AgreementWidget
              showDataShareCheckbox={false}
              disableButton={
                !(
                  selectedProduct &&
                  (products.find((p) => p.key === selectedProduct)?.terms ? selectedTerm : true)
                )
              }
            />
          </Grid.Col>
        </Grid>
        {moreInfo}
      </Box>
    </Box>
  );
};
