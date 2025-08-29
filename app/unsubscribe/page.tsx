'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

function UnsubscribePage() {
    const searchParams = useSearchParams();
    if(!searchParams) {
        return(<div/>)
    }
    const uuid = searchParams.get('uuid');

    useEffect(() => {
        if (uuid) {
            console.log('Unsubscribing UUID:', uuid);
            fetch('/api/unsubscribe_email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid }),
            })
            .then(res => res.json())
            .then(data => {
                console.log('Unsubscribe response:', data);
            })
            .catch(err => {
                console.error('Error unsubscribing:', err);
            });
        }
    }, [uuid]);

    return (
        <div>
            <h1>Unsubscribe</h1>
            <p>Your email has been unsubscribed successfully.</p>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UnsubscribePage />
        </Suspense>
    )
}