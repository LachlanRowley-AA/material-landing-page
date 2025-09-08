'use client';

import { ReactNode, useContext, useEffect, useState } from 'react';
import {
  IconCheck,
  IconCircleCheck,
  IconCirclePercentageFilled,
  IconClock,
  IconCreditCardPay,
  IconLockOpen2,
  IconPlus,
  IconRepeat,
} from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  Radio,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { CalculatorContext } from './CalculatorContext';

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

type ProductProps = {
  onProductClick: () => void;
  incompleteClick: () => void;
};

export default function CalculatorProducts({ onProductClick, incompleteClick }: ProductProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const ctx = useContext(CalculatorContext);
  const { baseValue, defaultInterestRate, selectedProduct, setSelectedProduct } = ctx;

  const HIGHLIGHT_COLOR = '#FFA500';
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
    moreClick?: boolean;
  };

  const products = [
    // {
    //   minimumAmount: 0,
    //   logo: '/Sydney Tools/sydney_tools.svg',
    //   key: 'Sydney Tools Pay',
    //   title: 'Sydney Tools Pay',
    //   items: [
    //     {
    //       text: 'Interest free account for 30 - 60 days',
    //       icon: <IconCirclePercentageFilled size={18} />,
    //     },
    //   ],
    //   moreInfo: {
    //     desc: 'Buy now and get between 30 & 60 days interest free',
    //     reasons: ['You have worked queued up', 'You are waiting for invoices to be paid'],
    //   },
    // },
    {
      minimumAmount: 10000,
      key: 'FlexPay',
      title: 'FlexPay',
      terms: [
        {
          length: 6,
          rate: defaultInterestRate,
        },
        {
          length: 12,
          rate: defaultInterestRate,
        },
        {
          length: 24,
          rate: defaultInterestRate,
        },
        {
          length: 36,
          rate: defaultInterestRate,
        },
      ],
      items: [
        {
          text: 'Longer term lengths',
          icon: <IconClock size={18} />,
        },
        {
          text: '6 - 36 months',
          icon: <IconClock size={18} />,
        },
        {
          text: 'Ideal if you need to purchase everything all at once',
          icon: <IconCreditCardPay size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Enjoy longer term lengths to minimise the impact to your cashflow',
        reasons: ['You need to make a large one-off payment'],
        interest: 'Interest starting from 11.45% p.a',
      },
      moreClick: true,
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
                      onProductClick();
                    }}
                    mb="xs"
                  >
                    <Box w="100%" py={0} my={0}>
                      <Text fw={600} c="black" fz="sm" ta="center" my={0}>
                        {term.length} months
                      </Text>
                      <Text c="black" fz="lg" fw="bold" ta="center" mt={4}>
                        $
                        {ctx
                          .calculateCustomRepayment(baseValue, term.rate, term.length)
                          .toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
          text: 'Ideal if you need to make frequent purchases',
          icon: <IconCreditCardPay size={18} />,
        },
      ],
      moreInfo: {
        desc: 'Set up a revolving line of credit',
        reasons: [
          'You need a payment extension for your account',
          'You need to make frequent purchases',
        ],
        interest: 'Interest starting from 0.03% per day',
      },
      layout: () => (
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
                  Borrowed amount
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
                / month (interest only)
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

  const modalbg = '#f6f6f6';
  const moreInfo = (
    <Modal
      opened={opened}
      onClose={close}
      size="auto"
      styles={{ content: { background: modalbg }, header: { background: modalbg } }}
      overlayProps={{
        backgroundOpacity: 0.8,
        c: 'red',
        blur: 5,
      }}
      radius="lg"
      fullScreen={isMobile}
    >
      <Grid w="100%">
        {products.map((product) => (
          <Grid.Col span={{ base: 12, md: 6 }} key={product.key} style={{ minWidth: 0 }}>
            <Card
              shadow="0 3px 8px rgba(0,0,0,0.2)"
              withBorder
              mx={{ base: 'xs', md: 'lg' }}
              px={{ base: 'xl', md: 'xl' }}
              h="100%"
              radius="lg"
            >
              <Text fw={800} mb="md" fz="xl" ta="center">
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
                py="sm"
              >
                {/* <Accordion.Item key='product' value={product.moreInfo?.reason || ''} /> */}
                <Accordion.Item key="reasons" value="reasons" mb={-2} w="100%">
                  <Accordion.Control>Ideal when</Accordion.Control>
                  <Accordion.Panel>
                    {product.moreInfo.reasons.map((reason) => (
                      <Group align="flex-start" key={reason}>
                        <IconCheck color="#01E194" />
                        <Text
                          style={{
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                            flex: 1,
                            maxWidth: '100%', // keeps inside the card
                          }}
                        >
                          {reason}
                        </Text>{' '}
                      </Group>
                    ))}
                    {!isMobile && <div style={{ marginBottom: '40px' }} />}
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="features" value="features" mt={0} bd="0px">
                  <Accordion.Control>Features</Accordion.Control>
                  <Accordion.Panel>
                    <Group align="flex-start" mb="xs">
                      <IconLockOpen2 color="#01E194" />
                      <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                        Unsecured
                      </Text>
                    </Group>

                    {product.items.map((item) => (
                      <Group align="flex-start" key={item.text} mb="xs">
                        <IconCircleCheck color="#01E194" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {item.text}
                        </Text>
                      </Group>
                    ))}
                    {product.moreInfo.interest && (
                      <Group key={product.moreInfo.interest}>
                        <IconCircleCheck color="#01E194" />
                        <Text style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>
                          {product.moreInfo.interest}
                        </Text>
                      </Group>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Text fw={600}>
                Minimum financed amount: ${product.minimumAmount.toLocaleString()}
              </Text>
              <Flex align="flex-end" justify="center">
                <Button
                  bg="#1fcfc3"
                  mt="xl"
                  onClick={() => {
                    setSelectedProduct(product.key);
                    sessionStorage.setItem('notes', product.key);
                    close();
                  }}
                  disabled={product.minimumAmount > baseValue}
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
      sessionStorage.setItem('loanAmount', ctx.startingAmount.toString());
    }
    if (!sessionStorage.getItem('customTimeframe')) {
      sessionStorage.setItem('customTimeframe', '12');
    }
  });

  useEffect(() => {
    const p = products.find((i) => i.key === selectedProduct);
    if (!p || p?.minimumAmount > baseValue) {
      setSelectedProduct('');
      incompleteClick();
    }
  }, []);

  return (
    <div>
      <Stack gap="xs" my={isMobile ? 'md' : 'xl'}>
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
                if (!product.moreClick) {
                  onProductClick();
                } else {
                  console.log('incomplete');
                  incompleteClick();
                }
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
          <Button ml="xl" onClick={open} bg="#1fcfc3">
            Learn More
          </Button>
        </Group>
      </Stack>
      {moreInfo}
    </div>
  );
}
