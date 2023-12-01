import { useEffect, useState } from 'react';
import { Button, Page } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

type Shop = {
  name: string;
  id: string;
};

type Theme = {
  id: number;
  name: string;
  role: string;
};

type InitialResponse = {
  shop: Shop;
  themes: Theme[];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);

    const getProducts = `#graphql
      {
        shop {
          name
          id
        }
      }
    `;

    const response = await admin.graphql(getProducts);
    const themesResponse = await admin.rest.resources.Theme.all({
      session: session,
    });
    const data = await response.json();

    return json({ ...data.data, themes: themesResponse.data });
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function createPage() {
  const [shop, setShop] = useState<Shop>({ id: '', name: '' });
  const [themes, setThemes] = useState<Theme[]>([]);

  const response = useLoaderData<InitialResponse>();

  useEffect(() => {
    setShop(response.shop);
    setThemes(response.themes);
  }, []);
  console.log(themes);

  return (
    <Page fullWidth>
      <ui-title-bar title={`Shop: ${shop.name}`}></ui-title-bar>
      <Button> </Button>
    </Page>
  );
}
