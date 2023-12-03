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
import { useLoaderData } from '@remix-run/react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/v1/page/656b1874ef9ce64efc9704bc'
        );
        const pageData = response.data; // Assuming the data you need is in the response

        // Process the pageData as needed

        setServerPAge(pageData);
        console.log(pageData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    console.log(serverPage);

    // Call the fetchData function

    const editor = grapesjs.init({
      container: '#editor',
      blockManager: {
        appendTo: '#blocks',
      },
      projectData: {
        pages: [
          {
            component: `
                <div class="test">Initial content</div>
                <style>.test { color: red }</style>
              `,
          },
        ],
      },
      // storageManager: {
      //   type: 'remote',
      //   stepsBeforeSave: 3,
      //   options: {
      //     remote: {
      //       fetchOptions: (opts) =>
      //         opts.method === 'OPTIONS' ? { method: 'GET' } : {},
      //       urlLoad: 'http://localhost:4000/v1/page/656b1874ef9ce64efc9704bc',
      //       urlStore: 'http://localhost:4000/v1/page/656b1874ef9ce64efc9704bc',
      //       onLoad: (result) => {
      //         const pageData = result.component;
      //         console.log(pageData);

      //         return pageData;
      //       },
      //     },
      //   },
      // },
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'min-height', 'padding'],
            properties: [
              {
                type: 'integer',
                name: 'The width',
                property: 'width',
                // units: ['px', '%'],
                defaults: 'auto',
                // min: 0,
              },
            ],
          },
        ],
      },
      layerManager: {
        appendTo: '#layers-container',
      },
      traitManager: {
        appendTo: '#trait-container',
      },
      selectorManager: {
        appendTo: '#styles-container',
      },
      panels: {
        defaults: [
          {
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true, // active by default
                className: 'btn-toggle-borders',
                // label: '<i class="fa fa-clone"></i>',
                command: 'sw-visibility', // Built-in command
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                // label: '<i class="fa fa-television"></i>',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
              },
              {
                id: 'device-mobile',

                // label: '<i class="fa fa-mobile"></i>',
                command: 'set-device-mobile',
                togglable: false,
              },
            ],
          },
        ],
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '480px',
          },
        ],
      },
      plugins: [gjsPluginCkEditor, gjsPluginBlocksBasic],
      pluginsOpts: {
        gjsPluginCkEditor: {},
        gjsPluginBlocksBasic: {},
      },
    });
    // Commands
    editor.Commands.add('set-device-desktop', {
      run: (editor) => editor.setDevice('Desktop'),
    });
    editor.Commands.add('set-device-mobile', {
      run: (editor) => editor.setDevice('Mobile'),
    });
    editor.Panels.removeButton('devices-c', 'block-editor');

    setEditor(editor);
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
