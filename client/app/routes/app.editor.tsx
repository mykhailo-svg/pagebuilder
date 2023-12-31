import { useState, useEffect, useRef } from 'react';
import { Button, Card, Page } from '@shopify/polaris';
import type { Editor } from 'grapesjs';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import mainCss from '../styles/main.css';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from '@remix-run/react';
import { Sidebar } from '~/components/Sidebar/Sidebar';
import { initEditorConfig } from '~/helpers/editorConfig';
import { TopNav } from '~/components/TopNav/TopNav';
import type { PageType } from '~/global_types';
import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getPageById, updatePage } from '~/models/page.server';
import { authenticate } from '~/shopify.server';

export const links = () => [
  { rel: 'stylesheet', href: grapesStyles },
  { rel: 'stylesheet', href: bootstrapCss },
  { rel: 'stylesheet', href: mainCss },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const pageId = url.searchParams.get('pageId') || '';

  const pageAssetName = formData.get('liquidName');
  const themeId = parseInt(formData.get('themeId') as string);

  const sectionKey =
    `sections/${formData.get('liquidName')}.liquid` ?? 'templates/error.liquid';
  const templateKey = `templates/page.${formData.get('liquidName')}.json`;
  const asset = new admin.rest.resources.Asset({ session: session });
  asset.theme_id = themeId;
  asset.key = sectionKey as string;
  asset.value = formData.get('html')?.toString() || 'Failed to save';
  await asset.save();

  const jsonAsset = new admin.rest.resources.Asset({ session: session });
  jsonAsset.theme_id = themeId;
  jsonAsset.key = templateKey as string;
  jsonAsset.value = `{
    "sections": {
      "${pageAssetName}": {
        "type": "${pageAssetName}",
        "settings": {
        }
      }
    },
    "order": [
      "${pageAssetName}"
    ]
  }`;
  await jsonAsset.save();

  const updatedPage = await updatePage({
    id: pageId,
    css: 'sd',
    html: formData.get('html')?.toString() || 'Failed to save',
  });

  return json({
    formDataObject: formData.get('html'),
    updatedPage,
    asset,
    jsonAsset,
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

  console.log(useActionData());

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
      editor.Panels.removeButton('devices-c', 'block-editor');

      setEditor(editor);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('liquidName', `${pageResponse.name}-${pageResponse.id}`);
    formData.append(
      'html',
      `${editor?.getHtml().toString()} <style>${editor?.getCss()}</style>`
    );
    formData.append('themeId', pageResponse.themeId);

    submit(formData, {
      method: 'post',
      action: `/app/editor?pageId=${pageResponse.id}`,
    });
  };

  return (
    <Page fullWidth>
      <Button url="/app/pages">{'< Back '}</Button>
      <Form ref={formRef} onSubmit={handleSubmit} method="post">
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
      </Form>
    </Page>
  );
}
