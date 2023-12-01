import { useCallback, useEffect, useState } from 'react';
import { Button, ChoiceList, Page, TextField } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';
import { ActionFunctionArgs, LoaderFunction, json } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { createNewPage, getPages } from '~/models/page.server';

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const page = await createNewPage({ themeId: 'dfdg' });

  return json({
    page,
  });
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
    const pages = await createNewPage({ themeId: 'dgfdtae2' });
    const data = await response.json();

    return json({ ...data.data, themes: themesResponse.data, pages });
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function createPage() {
  const [shop, setShop] = useState<Shop>({ id: '', name: '' });
  const [themes, setThemes] = useState<Theme[]>([]);
  const choices = themes.map((theme) => {
    return {
      label: `${theme.name} --- ${theme.role}`,
      value: theme.id.toString(),
    };
  });

  const response = useLoaderData<InitialResponse>();
  const createPageResponse = useActionData<typeof action>();
  console.log(createPageResponse);

  const [selected, setSelected] = useState<string[]>(['']);

  const handleChange = useCallback((value: string[]) => setSelected(value), []);

  useEffect(() => {
    console.log(response);

    setShop(response.shop);
    setThemes(response.themes);
    setSelected([response?.themes[0].id.toString()]);
  }, []);
  console.log(themes);

  return (
    <Page fullWidth>
      <ui-title-bar title={`Shop: ${shop.name}`}></ui-title-bar>
      <Form method="post">
        {themes ? (
          <ChoiceList
            title="Pick theme"
            choices={choices}
            selected={selected}
            onChange={handleChange}
          />
        ) : (
          ''
        )}
        <Button submit>Log</Button>
      </Form>
    </Page>
  );
}
