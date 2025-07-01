'use client';
import { useState, useEffect, useCallback} from 'react';
import { Loader } from '@mantine/core'
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import {UserDataDisplay} from '@/components/AccountData';
import { UseCases } from '@/components/UseCases/Usecases';
import { UploadInvoice } from '../UploadInvoice';

type UserDetails = {
    name: string;
    company: string;
    address: string;
    phoneNumber: string;
    balance: number | string;
};

export default function HomepageClient() {
    const [isPageReady, setIsPageReady] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [parsedBalance, setBalance] = useState<number>(0);

    // Memoize fetchUserData to avoid useEffect dependency issues
    const fetchUserData = useCallback(async () => {
        if (!apiKey) return;
        
        try {
            setError(null); // Clear any previous errors
            const response = await fetch(`/api/sheet?accountKey=${encodeURIComponent(apiKey)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            // Parse the balance if it's a string
            setBalance(parseFloat(data.data.balance.replace(/[\$,]/g, '')))

            console.log('User data fetched successfully:', data);
            setUserDetails(data.data);
            setIsPageReady(true);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch user data');
        }
        }, [apiKey]);

    // Get the API Key from the URL
    useEffect(() => {
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl);
        const key = params.get('accountKey');
        setApiKey(key);
        console.log('API key set:', key ? 'Present' : 'Not found');
    }, []);

    // Fetch user data when apiKey changes
    useEffect(() => {
        console.log('API key loaded, fetching data...');
        if (apiKey) {
            fetchUserData();
        } else {
            // If no API key, still show the page
            const windowUrl = window.location.search;
            const params = new URLSearchParams(windowUrl);
            const key = params.get('accountKey');
            if(!key) {
                setIsPageReady(true);
            }
        }
    }, [apiKey, fetchUserData]);

    // Loading state
    if (!isPageReady) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                backgroundColor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <Loader size="xl" color='#01E194'/>
                <div style={{
                    fontSize: '18px',
                    color: '#FFF',
                    fontWeight: 500
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                backgroundColor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{
                    fontSize: '18px',
                    color: '#FF6B6B',
                    fontWeight: 500,
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    Error: {error}
                </div>
                <button 
                    type="button"
                    onClick={() => {
                        setError(null);
                        setIsPageReady(false);
                        fetchUserData();
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#01E194',
                        color: 'black',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }
    return (
        <>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .fade-in-container {
                    opacity: 0;
                    animation: fadeIn 1s ease-in-out forwards;
                }
            `}</style>
            <div className="fade-in-container">
                <UserDataDisplay userDetails={userDetails}/>
                <UploadInvoice />
                <Calculator startingAmount={parsedBalance ?? 80000}/>
                <Feature02 />
                <UseCases />
                <FAQ />
                <section id="footer">
                    <ContactForm />
                </section>
                <Footer01 />    
            </div>
        </>
    );
}