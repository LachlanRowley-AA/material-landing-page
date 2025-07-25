'use client';
import { useState, useEffect, useCallback} from 'react';
import { Container, Grid, Loader } from '@mantine/core'
import { Feature02 } from '@/components/feature-02';
import  {Calculator}  from '@/components/Calculator/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { UserDataDisplay } from '@/components/AccountData';
import { UseCases } from '@/components/UseCases/Usecases';
import { UploadInvoice } from '@/components/UploadInvoice';
import { AgreementWidget } from '@/components/AgreementWidget';
import { Header01 } from '@/components/Header'
import { Hero02 } from '@/components/Hero02'
import  Welcome  from '@/components/Welcome'
import { UserDetails } from '@/lib/UserDetails';

export default function HomepageClient() {
    const [isPageReady, setIsPageReady] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [parsedBalance, setBalance] = useState<number>(0);

    const fetchUserData = useCallback(async () => {
        if (!apiKey) return;
        
        try {
            setError(null); // Clear any previous errors
            const response = await fetch(`https://script.google.com/macros/s/AKfycbxE7C_cBbmcK6WkX8r1LhzmksN1jS_U_dpEaE-oYbrHWBQxkuOk5jPlGF3y25MtrNpO/exec?accountKey=${encodeURIComponent(apiKey)}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            // Parse the balance if it's a string
            const rawBalance = data.data.balance;
            const cleanedBalance = typeof rawBalance === 'string'
            ? parseFloat(rawBalance.replace(/[\$,]/g, ''))
            : typeof rawBalance === 'number'
                ? rawBalance
                : 0; // fallback if undefined or invalid

            setBalance(cleanedBalance);
            console.log('User data fetched successfully:', data);
            setUserDetails(data.data);
            sessionStorage.setItem('userData', JSON.stringify(data.data));
            sessionStorage.setItem('loanAmount', data.data.balance.toString());
            sessionStorage.setItem('customTimeframe', '12');
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
        if(key) {
            sessionStorage.setItem('accountKey', key);
        }
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
            <div className="fade-in-container" >
                <Header01/>
                <div style={{paddingBottom:"40px"}}/>
                <Container px={{base:"0px", md:"20px" ,lg:"40px"}} mx={{base:"0px"}} fluid>
                    <section id="Home"><Welcome /></section>
                    <UserDataDisplay userDetails={userDetails}/>
                    {/* <UploadInvoice /> */}
                   
                        <Grid style={{overflow: 'hidden'}} mx="xl">
                            <Grid.Col span={{ md: 9}}>
                                <Calculator startingAmount={parsedBalance ?? 80000}/>
                            </Grid.Col>
                            <Grid.Col span={{ md: 3}}>
                                <section id="contact"><AgreementWidget /></section>
                            </Grid.Col>
                        </Grid>
                    
                </Container>
                <section id="About"><Feature02 /></section>
                <UseCases />
                <FAQ />
                <Footer01 />    
            </div>
        </>
    );
}