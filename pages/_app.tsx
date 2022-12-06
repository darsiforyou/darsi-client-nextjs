import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider } from "@mantine/notifications";
import Layout from '../components/layout';
import { persistor, store } from "../redux/store";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>
            <QueryClientProvider client={queryClient}>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <React.StrictMode>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </React.StrictMode>
                </PersistGate>
              </Provider>
            </QueryClientProvider>
          </NotificationsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </ColorSchemeProvider>
  )
}


