import { useState, useEffect } from 'react';
import { Button, Page } from '@shopify/polaris';
import grapesjs, { Editor } from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginCkEditor from 'grapesjs-plugin-ckeditor';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import { parseIntoLiquid } from '~/helpers/parseIntoLiquid';
import { LoaderFunction, json } from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { createNewPage, getPageById } from '~/models/page.server';
import { useLoaderData } from '@remix-run/react';
export const links = () => [{ rel: 'stylesheet', href: grapesStyles }];

type PageType = {
  id: string;
  css: string;
  html: string;
  themeId: string;
};

type LoaderResponse = {
  page: PageType;
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const pageId = url.searchParams.get('pageId') || '';
    const page = await getPageById(pageId);

    return json({ page });
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function AdditionalPage() {
  const [editor, setEditor] = useState<Editor>();
  const response = useLoaderData<LoaderResponse>();

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#editor',
      plugins: [gjsPresetWebpage, gjsPluginCkEditor, gjsPluginBlocksBasic],
      pluginsOpts: {
        gjsPresetWebpage: {},
        gjsPluginCkEditor: {},
        gjsPluginBlocksBasic: {},
      },
    });
    editor.setComponents(response.page.html);
    setEditor(editor);
  }, []);

  return (
    <Page fullWidth>
      <Button
        onClick={() => {
          const html = editor?.getHtml() ?? '';
          const css = editor?.getCss() ?? '';
          console.log(parseIntoLiquid({ html, css }));
        }}
      >
        Export
      </Button>
      <div id="editor"></div>
    </Page>
  );
}
