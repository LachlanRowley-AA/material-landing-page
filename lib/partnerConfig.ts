
import DBM_GET from "@/components/DBM_DataLoaderServer/GetData";


type AccountGetFn = (accountKey: string) => Promise<any>;

export type Partner = {
    displayName: string,
    accountGet?: AccountGetFn
    referrerId?: string;
    hasHighTouch?: boolean;
    email?: string;
}

export const partnerConfig: Record<string, Partner> = {
  default: { displayName: 'Eazytrade Partner', hasHighTouch: false },
  dbm: { displayName: 'DBM', accountGet: DBM_GET, referrerId: 'Z2RLL54', hasHighTouch: true},
  sydneytools: { displayName: 'Sydney Tools', hasHighTouch: false },
  nordin: { displayName: 'Nordin', hasHighTouch: false },
  bmsyd: { displayName: 'BM Sydney', hasHighTouch: false, email: 'lachlan@assetalley.com.au', referrerId: 'eoLZqdr' },
  assetalley: { displayName: 'AssetAlley', hasHighTouch: false, email: 'lachlan.rowley1@hotmail.com.au' },
};
