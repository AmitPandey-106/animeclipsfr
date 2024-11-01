import "@/styles/globals.css";
import "@/pages/components/nabvar";
import Nabvar from "@/pages/components/nabvar";
import { AuthProvider } from "../context/authcontext";
import { useState } from "react";
import Head from 'next/head'; // Import Head from next/head

export default function App({ Component, pageProps }) { 
  const [searchQuery, setSearchQuery] = useState(''); 

  return (
    <>
      <Head>
        <meta name="google-adsense-account" content="ca-pub-6008813570665985" />
        <title>AnimeClips</title>
      </Head>
      <AuthProvider>
        <Nabvar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
