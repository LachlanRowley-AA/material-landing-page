// // 'use client';

// // import { useState } from 'react';

// // export default function SheetsPage() {
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const fetchSheetsData = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
      
// //       const response = await fetch('/api/sheet', {
// //         method: 'GET',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           apiKey: 'fb5a8a5a-80b3-49a7-a1bc-26d42ad9dcf0'
// //         })
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const result = await response.json();
// //       setData(result);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'An error occurred');
// //       console.error('Error fetching sheets data:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8">
// //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="bg-white rounded-lg shadow-md p-6">
// //           <h1 className="text-2xl font-bold text-gray-900 mb-6">
// //             Google Sheets Data Fetcher
// //           </h1>
          
// //           <div className="mb-6">
// //             <button
// //               type='button'
// //               onClick={fetchSheetsData}
// //               disabled={loading}
// //               className={`px-6 py-3 rounded-md font-medium text-white transition-colors ${
// //                 loading
// //                   ? 'bg-gray-400 cursor-not-allowed'
// //                   : 'bg-blue-600 hover:bg-blue-700'
// //               }`}
// //             >
// //               {loading ? 'Loading...' : 'Fetch Sheets Data'}
// //             </button>
// //           </div>

// //           {error && (
// //             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
// //               <p className="text-red-800">
// //                 <strong>Error:</strong> {error}
// //               </p>
// //             </div>
// //           )}

// //           {data && (
// //             <div className="bg-gray-50 rounded-md p-4">
// //               <h2 className="text-lg font-semibold text-gray-900 mb-3">
// //                 Spreadsheet Data:
// //               </h2>
// //               <pre className="bg-white p-4 rounded border overflow-x-auto text-sm">
// //                 {JSON.stringify(data, null, 2)}
// //               </pre>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState } from 'react';
// import { generate } from '@pdfme/generator';
// import template from './template.json'; // Your exported template
// import { Button } from '@mantine/core';
// import { multiVariableText, rectangle, text } from '@pdfme/schemas'

// export default function GeneratePDF() {
//   const [ip] = useState('192.168.0.1'); // Ideally dynamically fetch this
//   const date = new Date().toLocaleDateString();

//   const handleGenerate = async () => {
//     const inputs = [
//       {
//         APPLICANT_FULL_NAME: '{"APPLICANT_FULL_NAME": "Lachlan Rowley"}',
//         APPLICANT_SIGNED_IP: '{"IP": "123456789101"}',
//         APPLICANT_SIGNED_DATE: '{"APPLICANT_SIGNED_DATE": "01/01/1444"}',
//         SIGNATURE: '{"SIGNATURE": "Lachlan Rowley"}',
//         APPLICANT_TWO_FIRST_NAME: 'Lachlan Rowley',
//       },
//     ];

//     const pdf = await generate({ template, inputs, plugins: { rectangle, text, multiVariableText } });
//     const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
//     const url = URL.createObjectURL(blob);
//     window.open(url);
//   };

//   return <Button onClick={handleGenerate}>Generate Signed PDF</Button>;
// }

