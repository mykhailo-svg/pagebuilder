import { useState, useEffect } from 'react';
import { Button, Form, Page } from '@shopify/polaris';
import grapesjs, { Editor } from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginCkEditor from 'grapesjs-plugin-ckeditor';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import { parseIntoLiquid } from '~/helpers/parseIntoLiquid';
import {
  ActionFunctionArgs,
  LoaderFunction,
  json,
  redirect,
} from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { createNewPage, getPageById } from '~/models/page.server';
import { useActionData, useLoaderData } from '@remix-run/react';
import axios from 'axios';

export const links = () => [{ rel: 'stylesheet', href: grapesStyles }];

type PageType = {
  id: string;
  css: string;
  html: string;
  themeId: string;
  shop: string;
  isPublished: boolean;
  isInShopify: boolean;
};

type LoaderResponse = {
  page: PageType;
  newPageData: PageType;
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const pageId = url.searchParams.get('pageId') || '';
    const page = await getPageById(pageId);
    const newPage = await axios
      .get(`http://localhost:4000/v1/page/${pageId}`)
      .catch((error) => {
        // Обробка помилки, якщо її виникне
        console.error('Помилка відправлення POST-запиту:', error);
      });
    const newPageData = newPage ? newPage.data : null;

    return json({ page, newPageData });
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function AdditionalPage() {
  const [editor, setEditor] = useState<Editor>();
  const [serverPage, setServerPAge] = useState<PageType>({
    id: '',
    shop: '',
    themeId: '',
    css: '',
    html: '',
    isInShopify: false,
    isPublished: false,
  });

  const response = useLoaderData<LoaderResponse>();
  console.log(response);

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
    setServerPAge(response.newPageData);
    editor.setComponents(response.newPageData.html);
    setEditor(editor);
  }, []);

  const handleSubmit = async () => {
    const html = editor?.getHtml() ?? '';
    const css = editor?.getCss() ?? '';
    // URL для PUT-запиту
    const url = `http://localhost:4000/v1/page/${serverPage.id}`;

    // JSON-об'єкт для відправлення у тілі PUT-запиту
    const data = {
      css,
      html,
    };

    // Виконання PUT-запиту з використанням Axios
    const response = await axios
      .put(url, data)
      .then((response) => {
        console.log('Відповідь сервера:', response.data);
      })
      .catch((error) => {
        console.error('Помилка при виконанні PUT-запиту:', error);
      });
  };

  return (
    <Page fullWidth>
      <Button onClick={handleSubmit}>Export</Button>
      <div id="editor"></div>
    </Page>
  );
}
