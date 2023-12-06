import { useCallback, useEffect, useState } from 'react';
import {
  BlockStack,
  Button,
  Card,
  ChoiceList,
  Divider,
  Page,
  TextField,
} from '@shopify/polaris';
import { authenticate } from '~/shopify.server';
import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { createNewPage } from '~/models/page.server';

type Theme = {
  id: number;
  name: string;
  role: string;
};

type InitialResponse = {
  themes: Theme[];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { session } = await authenticate.admin(request);

  const formDataObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  const page: any = await createNewPage({
    themeId: formDataObject.themePicker,
    shop: session.shop,
    name: formDataObject.nameField,
  });
  if (page) {
    return redirect(`/app/editor?pageId=${page.id}`);
  }
  return json({
    page,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);

    const themesResponse = await admin.rest.resources.Theme.all({
      session: session,
    });

    return json({ themes: themesResponse.data });
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function CreatePage() {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string>('');
  const [themes, setThemes] = useState<Theme[]>([]);
  useEffect(() => {
    if (name.length < 5) {
      setNameError('Enter 5 digit page name');
    } else {
      setNameError('');
    }
  }, [name]);

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
                  label="Your page name"
                  value={name}
                  onChange={(e) => setName(e.valueOf())}
                  autoComplete=""
                  placeholder="Beautiful page..."
                  name="nameField"
                  error={nameError}
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
