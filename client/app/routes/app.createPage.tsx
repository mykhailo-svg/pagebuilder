import { useCallback, useEffect, useState } from 'react';
import { Button, ChoiceList, Page, TextField } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';
import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { createNewPage } from '~/models/page.server';
import axios from 'axios';

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
  const formData = await request.formData();

  const formDataObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });
  const newPage = await axios
    .post('http://localhost:4000/v1/page', {
      themeId: formDataObject.themePicker,
      shop: formDataObject.shopField,
    })
    .catch((error) => {
      console.error('Помилка відправлення POST-запиту:', error);
    });

  const newPageData = newPage ? newPage.data : null;
  if (newPageData) {
    return redirect(`/app/additional?pageId=${newPageData.id}`);
  }
  return json({
    newPageData,
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

  const [selected, setSelected] = useState<string[]>(['']);

  const handleChange = useCallback((value: string[]) => setSelected(value), []);

  useEffect(() => {
    setShop(response.shop);
    setThemes(response.themes);
    setSelected([response?.themes[0].id.toString()]);
  }, []);

  return (
    <Page fullWidth>
      <Form method="post">
        {themes ? (
          <>
            <TextField
              label="Your shop"
              value={shop.name}
              autoComplete=""
              name="shopField"
            />
            <ChoiceList
              name="themePicker"
              title="Pick theme"
              choices={choices}
              selected={selected}
              onChange={handleChange}
            />
          </>
        ) : (
          ''
        )}
        <Button submit>Log</Button>
      </Form>
    </Page>
  );
}
