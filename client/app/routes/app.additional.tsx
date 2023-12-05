import { useState, useEffect } from 'react';
import { Button, Card, Page, TextField } from '@shopify/polaris';
import type { Editor } from 'grapesjs';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import mainCss from '../styles/main.css';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import {
  Form,
  useActionData,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import axios from 'axios';
import { Sidebar } from '~/components/Sidebar/Sidebar';
import { initEditorConfig } from '~/helpers/editorConfig';
import { TopNav } from '~/components/TopNav/TopNav';
import type { PageType } from '~/global_types';
import { ActionFunctionArgs, LoaderFunction, json } from '@remix-run/node';
import { getPageById, updatePage } from '~/models/page.server';
import { authenticate } from '~/shopify.server';
export const links = () => [
  { rel: 'stylesheet', href: grapesStyles },
  { rel: 'stylesheet', href: bootstrapCss },
  { rel: 'stylesheet', href: mainCss },
];

type FormFields = {
  htmlField: string;
  shopNameField: string;
  themeIdName: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const formDataObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  const updatedPage = await updatePage({
    id: '1701755268861-exahj6',
    css: 'sd',
    html: formDataObject.htmlField,
  });

  return json({
    formDataObject,
    updatedPage,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const pageId = url.searchParams.get('pageId') || '';
    const page = await getPageById(pageId);

    return json({});
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function AdditionalPage() {
  const [editor, setEditor] = useState<Editor>();
  const [serverPage, setServerPAge] = useState<PageType>();
  const [pageHTML, setPageHTML] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIdQueryParam = queryParams.get('pageId');

  const pageResponse = useLoaderData();
  console.log(pageResponse);

  useEffect(() => {
    const initEditor = async () => {
      try {
        const editor = initEditorConfig('nan');

        editor.Commands.add('set-device-desktop', {
          run: (editor) => editor.setDevice('Desktop'),
        });
        editor.Commands.add('set-device-mobile', {
          run: (editor) => editor.setDevice('Mobile'),
        });
        editor.on('update', () => {
          setPageHTML(editor.getHtml());
        });
        editor.Panels.removeButton('devices-c', 'block-editor');
        // setServerPAge(pageData);
        setEditor(editor);
        // return pageData;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    initEditor();
  }, []);

  const pageUpdateResponse = useActionData<typeof action>();

  const handleSubmit = async () => {
    if (!serverPage?.shouldPublish) {
      const html = editor?.getHtml() ?? '';
      const css = editor?.getCss() ?? '';
      const url = `http://localhost:4000/v1/page/${pageIdQueryParam}`;

      const data = {
        css,
        html,
      };
      console.log(data);

      const response = await axios
        .put(url, data)
        .then((response) => {
          console.log('Відповідь сервера:', response.data);
          setServerPAge(response.data);
          setPageHTML(response.data.html);
        })
        .catch((error) => {
          console.error('Помилка при виконанні PUT-запиту:', error);
        });
    } else {
      console.log('Publish');
    }
  };
  console.log(pageUpdateResponse);

  return (
    <Page fullWidth>
      <Button url="/app/pages">{'< Back '}</Button>
      <Form method="post">
        <TextField name="htmlField" value={pageHTML} autoComplete="" label="" />
        <TextField
          name="pageIdField"
          value={serverPage?.id}
          autoComplete=""
          label=""
        />
        <TextField
          name="themeIdField"
          value={serverPage?.themeId}
          autoComplete=""
          label=""
        />
        <Button submit>Export</Button>
      </Form>
      <div style={{ display: 'flex', gap: '30px', paddingTop: '10px' }}>
        <Sidebar
          pageName={serverPage?.name ?? ''}
          pageStatus={serverPage?.status ?? 'neverPublished'}
        />

        <div style={{ flex: '1 1 auto' }}>
          <Card>
            <nav className="navbar navbar-light">
              <div className="container-fluid">
                <TopNav
                  submit={handleSubmit}
                  shouldPublish={serverPage?.shouldPublish ?? false}
                />
              </div>
            </nav>
            <div id="editor"></div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
