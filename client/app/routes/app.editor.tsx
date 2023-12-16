import { useState, useEffect, useRef } from 'react';
import { Card, Frame, Page, Toast } from '@shopify/polaris';
import type { Editor } from 'grapesjs';
import mainCss from '../styles/main.css';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import { Fullscreen } from '@shopify/app-bridge/actions';
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

  const { themeId, id, name, templateType, template, shouldPublish } =
    JSON.parse(formData.get('page') as string) as PageType;

  if (shouldPublish) {
    const fileName = `${name}-${id}`;
    const sectionKey = `sections/${fileName}.liquid`;
    const templateKey = `templates/${templateType}.${fileName}.json`;

    const asset = new admin.rest.resources.Asset({ session: session });
    asset.theme_id = parseInt(themeId);
    asset.key = sectionKey as string;
    asset.value = formData.get('html')?.toString() as string;
    await asset.save();

    const jsonAsset = new admin.rest.resources.Asset({ session: session });
    jsonAsset.theme_id = parseInt(themeId);
    jsonAsset.key = templateKey as string;
    jsonAsset.value = template;
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
  const [isFullScreen, setIsFullscreen] = useState(true);
  useEffect(() => {
    if (isFullScreen) {
      const fullscreen = Fullscreen.create(app);
      fullscreen.dispatch(Fullscreen.Action.ENTER);
    } else {
      const fullscreen = Fullscreen.create(app);
      fullscreen.dispatch(Fullscreen.Action.EXIT);
    }
  }, [isFullScreen]);

  const [editor, setEditor] = useState<Editor>();
  const pageResponse = useLoaderData<PageType>();
  const pageUpdateResponse = useActionData<{ page: PageType }>();
  const [canSave, setCanSave] = useState<boolean>(!pageResponse.shouldPublish);
  const [activeToast, setActiveToast] = useState(false);

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullScreen);
  };

  useEffect(() => {
    try {
      const editor = initEditorConfig(pageResponse.html);

      editor.Commands.add('set-device-desktop', {
        run: (editor) => editor.setDevice('Desktop'),
      });
      editor.Panels.addPanel({
        id: 'gjs-settings',
        visible: true,
        buttons: [
          {
            id: 'btn-settings',
            className: 'fa fa-cog',
            command: function () {
              // Handle click event or open your settings panel
              alert('Settings clicked!');
            },
            attributes: {
              title: 'Settings',
            },
          },
        ],
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
    formData.append(
      'html',
      `${editor?.getHtml().toString()} <style>${editor?.getCss()}</style>`
    );
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
          <EditorHeader
            handleFullscreenToggle={handleFullscreenToggle}
            canSave={canSave}
            page={pageResponse}
          />
        </Form>
        <div style={{ display: 'flex', gap: '30px', paddingTop: '10px' }}>
          <Sidebar />

          <div style={{ flex: '1 1 auto', height: '85vh', overflow: 'auto' }}>
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
