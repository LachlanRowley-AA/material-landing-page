'use client';

import {
  Anchor,
  Burger,
  Button,
  Container,
  ContainerProps,
  Flex,
  Group,
  MantineBreakpoint,
  MantineRadius,
  Text,
  Image,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import NextLink from 'next/link';
import classes from './index.module.css';
import { text } from 'stream/consumers';

export type HeaderLink = {
  label: string;
  href: string;
};

const HEADER_LINKS: HeaderLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
];

type Header01Props = ContainerProps & {
  /** Logo to display in the header */
  logo?: React.ReactNode;

  /** Links to display in the header */
  links?: HeaderLink[];

  /** Title for the call to action button */
  callToActionTitle?: string;

  /** URL for the call to action button */
  callToActionUrl?: string;

  /** Callback for when the menu is toggled */
  onMenuToggle?: () => void;

  /** Whether the menu is open */
  isMenuOpen?: boolean;

  /** Breakpoint at which the menu is displayed */
  breakpoint?: MantineBreakpoint;

  /** Border radius of the header */
  radius?: MantineRadius | number;
};

export const Header01 = ({
  style,
  breakpoint = 'xs',
  logo = (
    <Image src="/dbm.png" h={30} maw={200}/>
  ),
  callToActionTitle = 'Request a Callback',
  callToActionUrl = '#',
  links = HEADER_LINKS,
  onMenuToggle,
  isMenuOpen,
  h = 60,
  ...containerProps
}: Header01Props) => (
  <Container
    className={classes.container}
    component="header"
    style={{ ...style }}
    w={{ base: '100%' }}
    h={h}
    maw='100vw'
    {...containerProps}
  >
    <Flex
      justify="space-between"
      align="center"
      h="100%"
      style={{ overflow: 'hidden' }}
      gap="xs"
      wrap="nowrap"
    >
      <Group gap={0} style={{ flexShrink: 0 }}>
        <Burger size="sm" opened={isMenuOpen} onClick={onMenuToggle} hiddenFrom={breakpoint} />
        {logo}
      </Group>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 'fit-content', opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        <Flex
          flex={1}
          justify="center"
          px="lg"
          h="100%"
          align="center"
          wrap="nowrap"
          visibleFrom={breakpoint}
          gap="lg"
          className={classes['link-container']}
        >
          {links.map((link) => (
            <Anchor
              key={link.href}
              className={classes.link}
              href={link.href}
              component={NextLink}
              td="none"
            >
              {link.label}
            </Anchor>
          ))}
        </Flex>
      </motion.div>
      <Button
        component={NextLink}
        href={callToActionUrl}
        className={classes.cta}
        radius="xl"
        rightSection={<IconArrowRight size={16} />}
        style={{ flexShrink: 0 }}
        styles={{
          label: {
            color:"#fc8900"
          },
          section: {
            color:"#fc8900"
          }
      }}
      >
        {callToActionTitle}
      </Button>
    </Flex>
  </Container>
);