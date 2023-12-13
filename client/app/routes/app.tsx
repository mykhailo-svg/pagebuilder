import type { HeadersFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css';
import { boundary } from '@shopify/shopify-app-remix/server';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { authenticate } from '../shopify.server';
import { Provider, useAppBridge } from '@shopify/app-bridge-react';
export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];
import { sessionStorage } from '../shopify.server';
import { useEffect, useState } from 'react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return json({
    apiKey: process.env.SHOPIFY_API_KEY || '',
  });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  const [canShow, setCanShow] = useState(false);
  useEffect(() => {
    setCanShow(true);
  }, []);
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      {canShow ? (
        <Provider config={shopify.config}>
          <ui-nav-menu>
            <a href="/app/" rel="home">
              Home
            </a>
            <a href="/app/">Dashboard</a>
            <a href="/app/pages/">Pages</a>
            <a href="/app/createPage/">Create page</a>
          </ui-nav-menu>
          <Outlet />
        </Provider>
      ) : (
        ''
      )}
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
