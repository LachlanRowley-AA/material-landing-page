import { createContext } from 'react';
import { Partner, partnerConfig } from '@/lib/partnerConfig';


export const PartnerContext = createContext<Partner>(partnerConfig.default);