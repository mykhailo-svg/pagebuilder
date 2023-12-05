import { useCallback, useEffect, useState } from 'react';
import {
  BlockStack,
  Button,
  Card,
  ChoiceList,
  Page,
  TextField,
} from '@shopify/polaris';
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
      name: formDataObject.nameField,
    })
    .catch((error) => {
      console.error('Помилка відправлення POST-запиту:', error);
    });

  const newPageData = newPage ? newPage.data : null;
  const pages = await createNewPage({
    themeId: formDataObject.themePicker,
    shop: formDataObject.shopField,
    name: formDataObject.nameField,
  });
  if (newPageData) {
    return redirect(`/app/additional?pageId=${newPageData.id}`);
  }
  return json({
    newPageData,
    pages,
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

    const data = await response.json();

    return json({ ...data.data, themes: themesResponse.data });
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function CreatePage() {
  const [shop, setShop] = useState<Shop>({ id: '', name: '' });
  const [name, setName] = useState('');
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
      <Card>
        <Form method="post">
          {themes ? (
            <>
              <BlockStack gap="500">
                <TextField
                  readOnly
                  label="Your shop"
                  value={shop.name}
                  autoComplete=""
                  name="shopField"
                />
                <TextField
                  label="Your page name"
                  value={name}
                  onChange={(e) => setName(e.valueOf())}
                  autoComplete=""
                  placeholder="Beautiful page..."
                  name="nameField"
                />
                <ChoiceList
                  name="themePicker"
                  title="Pick theme"
                  choices={choices}
                  selected={selected}
                  onChange={handleChange}
                />
                <Button variant="primary" submit>
                  Create page
                </Button>
              </BlockStack>
            </>
          ) : (
            ''
          )}
        </Form>
      </Card>
    </Page>
  );
}
