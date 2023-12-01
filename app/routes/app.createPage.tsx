import { useEffect, useState } from 'react';
import { Button, Page } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

type Shop = {
  name: string;
  id: string;
};

type InitialResponse = {
  shop: Shop;
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const getProducts = `#graphql
      {
        shop {
          name
          id
        }
      }
    `;

    const response = await admin.graphql(getProducts);
    const data = await response.json();

    return json(data.data);
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function createPage() {
  const [shop, setShop] = useState<Shop>({ id: '', name: '' });

  const response = useLoaderData<InitialResponse>();

  useEffect(() => {
    setShop(response.shop);
  }, []);
  console.log(shop);

  return (
    <Page fullWidth>
      <ui-title-bar title={`Shop: ${shop.name}`}></ui-title-bar>
      <Button> </Button>
    </Page>
  );
}
