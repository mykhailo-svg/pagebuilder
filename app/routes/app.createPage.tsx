import { useCallback, useEffect, useState } from 'react';
import { Button, ChoiceList, Page, TextField } from '@shopify/polaris';
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

const PickerChildren = () => {
  return <div>wefdgd</div>;
};

export default function createPage() {
  const [shop, setShop] = useState<Shop>({ id: '', name: '' });
  const [themes, setThemes] = useState<Theme[]>([]);
  const choices = [{ label: 'None', value: 'none' }];

  const response = useLoaderData<InitialResponse>();
  const [selected, setSelected] = useState<string[]>(['']);
  const [textFieldValue, setTextFieldValue] = useState('');

  const handleChange = useCallback((value: string[]) => setSelected(value), []);
  const renderChildren = () => <PickerChildren />;

  const renderPickerChildren = (ad: string) => <PickerChildren />;
  useEffect(() => {
    setShop(response.shop);
    setThemes(response.themes);
  }, []);
  console.log(themes);

  return (
    <Page fullWidth>
      <ui-title-bar title={`Shop: ${shop.name}`}></ui-title-bar>
      {themes ? (
        <ChoiceList
          title="Discount minimum requirements"
          choices={choices}
          selected={selected}
          onChange={handleChange}
        />
      ) : (
        ''
      )}
    </Page>
  );
}
