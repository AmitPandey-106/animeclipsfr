import "@/styles/globals.css";
import "@/pages/components/nabvar"
import Nabvar from "@/pages/components/nabvar";
import { AuthProvider } from "../context/authcontext";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <>
    <AuthProvider>
    <Nabvar searchQuery={searchQuery} setSearchQuery={setSearchQuery}></Nabvar>
    <Component {...pageProps} />
    </AuthProvider>
    </>
  )
}
