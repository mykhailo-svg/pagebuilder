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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const formDataObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  return json({
    form: formDataObject,
  });
};

export default function AdditionalPage() {
  const [editor, setEditor] = useState<Editor>();
  const [formData, setFormData] = useState<Record<string, string>>({}); // Додавання стейту для даних форми
  const response = useLoaderData<LoaderResponse>();
  const updatePageResponse = useActionData<typeof action>();
  console.log(updatePageResponse + 'sd');

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
    editor.setComponents(response.newPageData.html);
    setEditor(editor);
  }, []);

  const handleSubmit = () => {
    const html = editor?.getHtml() ?? '';
    const css = editor?.getCss() ?? '';
    console.log(parseIntoLiquid({ html, css }));

    // Оновлення стейту з даними форми
    const newFormData = { ...formData, html, css };
    setFormData(newFormData);
  };

  return (
    <Page fullWidth>
      <Button submit>Export</Button>
      <div id="editor"></div>
    </Page>
  );
}
