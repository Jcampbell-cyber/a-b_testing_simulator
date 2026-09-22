import React from "react";  
import { createRoot } from "react-dom/client";  
import { BrowserRouter } from "react-router-dom";  
import App from "./App.tsx";  
import "./index.css";  
import { GAListener } from './GAListener';  
import { HelmetProvider } from 'react-helmet-async';  
import posthog from 'posthog-js';  
import { PostHogProvider } from 'posthog-js/react';
 
posthog.init('phc_kJqyofaSXhRqdD9cW768tjFaYFm2A9db3amwaudL74Gd', {  
 api_host: 'https://eu.i.posthog.com',  
});
 
createRoot(document.getElementById("root")!).render(  
 <React.StrictMode>  
 <PostHogProvider client={posthog}>  
 <HelmetProvider>  
 <BrowserRouter>  
 <GAListener />  
 <App />  
 </BrowserRouter>  
 </HelmetProvider>  
 </PostHogProvider>  
 </React.StrictMode>  
);  
