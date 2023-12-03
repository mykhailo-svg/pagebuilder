import { useState, useEffect } from 'react';
import { Button, Card, InlineGrid, Page, Text } from '@shopify/polaris';
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
import { TopNav } from '~/components/TopNav/TopNav';
import { PageType } from '~/global_types';

export const links = () => [
  { rel: 'stylesheet', href: grapesStyles },
  { rel: 'stylesheet', href: bootstrapCss },
  { rel: 'stylesheet', href: mainCss },
];

type LoaderResponse = {
  pageData: PageType;
};

export default function AdditionalPage() {
  const [editor, setEditor] = useState<Editor>();
  const [serverPage, setServerPAge] = useState<PageType>();
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

        const editor = initEditorConfig(pageData.html);

        editor.Commands.add('set-device-desktop', {
          run: (editor) => editor.setDevice('Desktop'),
        });
        editor.Commands.add('set-device-mobile', {
          run: (editor) => editor.setDevice('Mobile'),
        });
        editor.Panels.removeButton('devices-c', 'block-editor');
        setServerPAge(pageData);
        setEditor(editor);
        return pageData;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    console.log(serverPage);

    // Call the fetchData function
  }, []);

  console.log(serverPage);

  const handleSubmit = async () => {
    if (!serverPage?.shouldPublish) {
      const html = editor?.getHtml() ?? '';
      const css = editor?.getCss() ?? '';
      const url = `http://localhost:4000/v1/page/${myParam}`;

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
        })
        .catch((error) => {
          console.error('Помилка при виконанні PUT-запиту:', error);
        });
    } else {
      console.log('Publish');
    }
  };

  return (
    <Page fullWidth>
      <div style={{ display: 'flex', gap: '30px' }}>
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
