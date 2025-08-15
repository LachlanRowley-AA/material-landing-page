
import DBM_GET from "@/components/DBM_DataLoaderServer/GetData";

// Type for the function you want to store
type AccountGetFn = (accountKey: string) => Promise<any>;

export type Partner = {
    displayName: string,
    accountGet?: AccountGetFn
}

export const partnerConfig: Record<string, Partner> = {
  default: { displayName: 'Eazytrade Partner' },
  dbm: { displayName: 'DBM', accountGet: DBM_GET }
};
