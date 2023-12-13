import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Divider,
  Icon,
  InlineStack,
  OptionList,
  Page,
  Select,
  TextField,
} from '@shopify/polaris';
import mainStyles from '../styles/main.css';
import { IdentityCardFilledMajor } from '@shopify/polaris-icons';
import { authenticate } from '~/shopify.server';
import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useSubmit } from '@remix-run/react';
import { createNewPage } from '~/models/page.server';

type Theme = {
  id: number;
  name: string;
  role: string;
};

type InitialResponse = {
  themes: Theme[];
};

export const links = () => [{ rel: 'stylesheet', href: mainStyles }];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { session } = await authenticate.admin(request);

  const page: any = await createNewPage({
    themeId: (formData.get('themePicker') as string) || 's',
    shop: session.shop,
    name: formData.get('nameField') as string,
    templateType: formData.get('templatePicker') as string,
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
  const response = useLoaderData<InitialResponse>();
  const [selectedTemplate, setSelectedTemplate] = useState('today');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string>('');
  const [themes, setThemes] = useState<Theme[]>(response.themes);
  useEffect(() => {
    if (name.length >= 5) {
      setNameError('');
    }
  }, [name]);

  const [selected, setSelected] = useState<string[]>([
    response.themes[0].id.toString(),
  ]);

  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (name.length < 5) {
      setNameError('Enter 5 digit page name');
    } else {
      const formData = new FormData(formRef.current as HTMLFormElement);
      formData.append('themePicker', selected[0]);
      formData.append('templatePicker', selectedTemplate);

      submit(formData, { method: 'post', action: '/app/createPage' });
    }
  };

  const handleSelectChange = useCallback(
    (value: string) => setSelectedTemplate(value),
    []
  );

  return (
    <Page fullWidth>
      <Card>
        <Form method="post" ref={formRef} onSubmit={handleSubmit}>
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
                <Divider />
                <Select
                  label="Pick templete as starter"
                  options={[
                    { value: 'page', label: 'Page' },
                    { value: 'product', label: 'Product' },
                    { value: 'collection', label: 'Collection' },
                  ]}
                  name="templatePicker"
                  onChange={handleSelectChange}
                  value={selectedTemplate}
                />
                <div className="optionList">
                  <OptionList
                    title="Pick theme"
                    onChange={setSelected}
                    options={themes.map((theme) => {
                      return {
                        value: theme.id.toString(),
                        label: (
                          <div className="themesOptionListItem">
                            {theme.name}
                            <Badge
                              size="large"
                              tone={
                                theme.role === 'main' ? 'success' : 'critical'
                              }
                            >
                              {theme.role}
                            </Badge>
                          </div>
                        ),
                      };
                    })}
                    selected={selected}
                  />
                </div>

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
