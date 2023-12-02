//@ts-nocheck
import { useState, useEffect } from 'react';
import { Button, Page } from '@shopify/polaris';
import type { Editor } from 'grapesjs';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginCkEditor from 'grapesjs-plugin-ckeditor';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { useLoaderData } from '@remix-run/react';
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
  pageData: PageType;
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const pageId = url.searchParams.get('pageId') || '';
    const page = await axios
      .get(`http://localhost:4000/v1/page/${pageId}`)
      .catch((error) => {
        console.error('Помилка відправлення POST-запиту:', error);
      });
    const pageData = page ? page.data : null;

    return json({ pageData });
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
    setServerPAge(response.pageData);
    editor.setComponents(response.pageData.html);
    setEditor(editor);
  }, []);

  const handleSubmit = async () => {
    const html = editor?.getHtml() ?? '';
    const css = editor?.getCss() ?? '';
    const url = `http://localhost:4000/v1/page/${serverPage.id}`;

    const data = {
      css,
      html,
    };

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
      <div id="navbar" className="sidenav d-flex flex-column overflow-scroll">
        <nav className="navbar navbar-light">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h3 logo">Code Dexterous</span>
          </div>
        </nav>
        <div className="">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="block-tab"
                data-bs-toggle="tab"
                data-bs-target="#block"
                type="button"
                role="tab"
                aria-controls="block"
                aria-selected="true"
              >
                <i className="fa fa-cubes"></i>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="layer-tab"
                data-bs-toggle="tab"
                data-bs-target="#layer"
                type="button"
                role="tab"
                aria-controls="layer"
                aria-selected="false"
              >
                <i className="fa fa-tasks"></i>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="style-tab"
                data-bs-toggle="tab"
                data-bs-target="#style"
                type="button"
                role="tab"
                aria-controls="style"
                aria-selected="false"
              >
                <i className="fa fa-paint-brush"></i>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="trait-tab"
                data-bs-toggle="tab"
                data-bs-target="#trait"
                type="button"
                role="tab"
                aria-controls="trait"
                aria-selected="false"
              >
                <i className="fa fa-cog"></i>
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="block"
              role="tabpanel"
              aria-labelledby="block-tab"
            >
              <div id="blocks"></div>
            </div>
            <div
              className="tab-pane fade"
              id="layer"
              role="tabpanel"
              aria-labelledby="layer-tab"
            >
              <div id="layers-container"></div>
            </div>
            <div
              className="tab-pane fade"
              id="style"
              role="tabpanel"
              aria-labelledby="style-tab"
            >
              <div id="styles-container"></div>
            </div>
            <div
              className="tab-pane fade"
              id="trait"
              role="tabpanel"
              aria-labelledby="trait-tab"
            >
              <div id="trait-container"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-content">
        <nav className="navbar navbar-light">
          <div className="container-fluid">
            <div className="panel__devices"></div>
            <div className="panel__basic-actions"></div>
          </div>
        </nav>
        <div id="editor"></div>
      </div>
    </Page>
  );
}
