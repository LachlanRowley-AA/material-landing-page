'use server'

import { fetchWithCache } from '@/lib/serverCache';

export default async function GetData(accountKey : string) {
    const url = `https://script.google.com/macros/s/AKfycbxE7C_cBbmcK6WkX8r1LhzmksN1jS_U_dpEaE-oYbrHWBQxkuOk5jPlGF3y25MtrNpO/exec?accountKey=${encodeURIComponent(accountKey)}`;
    const data = await fetchWithCache(url, 120_000); // 2-minute TTL
    return data;
}