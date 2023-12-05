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

export const links = () => [
  { rel: 'stylesheet', href: grapesStyles },
  { rel: 'stylesheet', href: bootstrapCss },
  { rel: 'stylesheet', href: mainCss },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const url = new URL(request.url);
  const pageId = url.searchParams.get('pageId') || '';
  const formDataObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  const updatedPage = await updatePage({
    id: pageId,
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

    return json(page);
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

  const pageResponse = useLoaderData<PageType>();
  console.log(pageResponse);

  useEffect(() => {
    try {
      const editor = initEditorConfig(pageResponse.html);

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

      setEditor(editor);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  const pageUpdateResponse = useActionData<typeof action>();

  return (
    <Page fullWidth>
      <Button url="/app/pages">{'< Back '}</Button>
      <Form method="post">
        <TextField name="htmlField" value={pageHTML} autoComplete="" label="" />
        <TextField
          name="pageIdField"
          value={pageResponse.id}
          autoComplete=""
          label=""
        />
        <TextField
          name="themeIdField"
          value={pageResponse.themeId}
          autoComplete=""
          label=""
        />
        <Button submit>Export</Button>
      </Form>
      <div style={{ display: 'flex', gap: '30px', paddingTop: '10px' }}>
        <Sidebar
          pageName={pageResponse.name}
          pageStatus={pageResponse.status}
        />

        <div style={{ flex: '1 1 auto' }}>
          <Card>
            <nav className="navbar navbar-light">
              <div className="container-fluid">
                <TopNav shouldPublish={pageResponse.shouldPublish} />
              </div>
            </nav>
            <div id="editor"></div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
