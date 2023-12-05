import { useState, useEffect } from 'react';
import { Button, Card, Page } from '@shopify/polaris';
import type { Editor } from 'grapesjs';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import mainCss from '../styles/main.css';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
import { useLocation } from '@remix-run/react';
import axios from 'axios';
import { Sidebar } from '~/components/Sidebar/Sidebar';
import { initEditorConfig } from '~/helpers/editorConfig';
import { TopNav } from '~/components/TopNav/TopNav';
import type { PageType } from '~/global_types';
export const links = () => [
  { rel: 'stylesheet', href: grapesStyles },
  { rel: 'stylesheet', href: bootstrapCss },
  { rel: 'stylesheet', href: mainCss },
];

export default function AdditionalPage() {
  const [editor, setEditor] = useState<Editor>();
  const [serverPage, setServerPAge] = useState<PageType>();
  console.log(serverPage);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIdQueryParam = queryParams.get('pageId');
  console.log(pageIdQueryParam);

  useEffect(() => {
    const initEditor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/v1/page/${pageIdQueryParam}`
        );
        const pageData = response.data;

        const editor = initEditorConfig(pageData.html);

        editor.Commands.add('set-device-desktop', {
          run: (editor) => editor.setDevice('Desktop'),
        });
        editor.Commands.add('set-device-mobile', {
          run: (editor) => editor.setDevice('Mobile'),
        });
        editor.on('update', () => {
          console.log('Update');
        });
        editor.Panels.removeButton('devices-c', 'block-editor');
        setServerPAge(pageData);
        setEditor(editor);
        return pageData;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    initEditor();
    console.log(serverPage);
  }, []);

  console.log(serverPage);

  const handleSubmit = async () => {
    if (!serverPage?.shouldPublish) {
      const html = editor?.getHtml() ?? '';
      const css = editor?.getCss() ?? '';
      const url = `http://localhost:4000/v1/page/${pageIdQueryParam}`;

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
      <Button url="/app/pages">{'< Back '}</Button>
      <div style={{ display: 'flex', gap: '30px', paddingTop: '10px' }}>
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
