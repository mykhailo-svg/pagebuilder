import { useState, useEffect, useRef } from 'react';
import { Card, Frame, Page, Toast } from '@shopify/polaris';
import type { Editor } from 'grapesjs';
import mainCss from '../styles/main.css';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import { Redirect, Fullscreen } from '@shopify/app-bridge/actions';
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from '@remix-run/react';
import { Sidebar } from '~/components/Sidebar';
import { initEditorConfig } from '~/helpers/editorConfig';
import { TopNav } from '~/components/TopNav';
import type { PageType } from '~/global_types';
import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getPageById, updatePage } from '~/models/page.server';
import { authenticate } from '~/shopify.server';
import { EditorHeader } from '~/components/EditorHeader';
import { useAppBridge } from '@shopify/app-bridge-react';

export const links = () => [
  { rel: 'stylesheet', href: grapesStyles },
  { rel: 'stylesheet', href: mainCss },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { admin, session } = await authenticate.admin(request);

  const { themeId, id, name, templateType, shouldPublish } = JSON.parse(
    formData.get('page') as string
  ) as PageType;

  if (shouldPublish) {
    const sectionKey =
      `sections/${name}-${id}.liquid` ?? 'templates/error.liquid';
    const templateKey = `templates/${templateType}.${formData.get(
      'liquidName'
    )}.json`;

    const asset = new admin.rest.resources.Asset({ session: session });
    asset.theme_id = parseInt(themeId);
    asset.key = sectionKey as string;
    asset.value = formData.get('html')?.toString() || 'Failed to save';
    await asset.save();

    const jsonAsset = new admin.rest.resources.Asset({ session: session });
    jsonAsset.theme_id = parseInt(themeId);
    jsonAsset.key = templateKey as string;
    jsonAsset.value = formData.get('pageTemplate') as string;
    await jsonAsset.save();
  }

  const updatedPage = await updatePage({
    id,
    css: 'sd',
    html: formData.get('html')?.toString() || 'Failed to save',
  });

  return json({
    formDataObject: formData.get('html'),
    page: updatedPage,
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
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  let fullscreen = null;
  useEffect(() => {
    fullscreen = Fullscreen.create(app);
    fullscreen.dispatch(Fullscreen.Action.ENTER);
  }, []);
  const [editor, setEditor] = useState<Editor>();
  const pageResponse = useLoaderData<PageType>();
  const pageUpdateResponse = useActionData<{ page: PageType }>();
  const [canSave, setCanSave] = useState<boolean>(!pageResponse.shouldPublish);
  const [activeToast, setActiveToast] = useState(false);

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
      editor.on('update', () => {
        setCanSave(false);
      });
      setEditor(editor);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    if (pageUpdateResponse) {
      setActiveToast(true);
      setCanSave(!pageUpdateResponse.page.shouldPublish);
    }
  }, [pageUpdateResponse]);

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
    formData.append('pageTemplate', pageResponse.template);
    formData.append('pageTemplateType', pageResponse.templateType);
    formData.append('page', JSON.stringify(pageResponse));

    submit(formData, {
      method: 'post',
      action: `/app/editor?pageId=${pageResponse.id}`,
    });
  };

  return (
    <Page fullWidth>
      <Frame>
        {activeToast ? (
          <Toast
            content={`Page succesfully ${
              pageResponse.shouldPublish ? 'saved' : 'published'
            }`}
            duration={5000}
            onDismiss={() => setActiveToast(false)}
          />
        ) : (
          ''
        )}

        <Form ref={formRef} onSubmit={handleSubmit} method="post">
          <EditorHeader canSave={canSave} page={pageResponse} />
        </Form>
        <div style={{ display: 'flex', gap: '30px', paddingTop: '10px' }}>
          <Sidebar />

          <div style={{ flex: '1 1 auto' }}>
            <Card>
              <nav className="navbar navbar-light">
                <div className="container-fluid">
                  <TopNav />
                </div>
              </nav>
              <div id="editor"></div>
            </Card>
          </div>
        </div>
      </Frame>
    </Page>
  );
}
