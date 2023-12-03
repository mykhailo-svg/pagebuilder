import { useState, useEffect } from 'react';
import { Button, Page } from '@shopify/polaris';
import type { Editor } from 'grapesjs';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginCkEditor from 'grapesjs-plugin-ckeditor';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import mainCss from '../styles/main.css';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { useLoaderData, useLocation, useParams } from '@remix-run/react';
import axios from 'axios';
import { Sidebar } from '~/components/Sidebar/Sidebar';
import { initEditorConfig } from '~/helpers/editorConfig';

export const links = () => [
  { rel: 'stylesheet', href: grapesStyles },
  { rel: 'stylesheet', href: bootstrapCss },
  { rel: 'stylesheet', href: mainCss },
];

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

export default function AdditionalPage() {
  const [editor, setEditor] = useState<Editor>();
  const [serverPage, setServerPAge] = useState();
  console.log(serverPage);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const myParam = queryParams.get('pageId');
  console.log(myParam);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/v1/page/${myParam}`
        );
        const pageData = response.data; // Assuming the data you need is in the response

        const editor = initEditorConfig(pageData.component);

        editor.Commands.add('set-device-desktop', {
          run: (editor) => editor.setDevice('Desktop'),
        });
        editor.Commands.add('set-device-mobile', {
          run: (editor) => editor.setDevice('Mobile'),
        });
        editor.Panels.removeButton('devices-c', 'block-editor');
        setServerPAge(pageData);
        return pageData;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    console.log(serverPage);

    // Call the fetchData function
  }, []);

  const handleSubmit = async () => {
    const html = editor?.getHtml() ?? '';
    const css = editor?.getCss() ?? '';
    const url = `http://localhost:4000/v1/page/s`;

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
        <Sidebar />
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
