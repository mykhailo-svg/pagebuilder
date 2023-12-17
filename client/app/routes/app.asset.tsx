import * as React from 'react';
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from '@grapesjs/react';
import type { Editor, EditorConfig } from 'grapesjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MAIN_BORDER_COLOR } from '../components/common';
import CustomModal from '../components/CustomModal';
import CustomAssetManager from '../components/CustomAssetManager';
import Topbar from '../components/Topbar';
import RightSidebar from '../components/RightSidebar';
import { useEffect, useState } from 'react';
import { Card } from '@shopify/polaris';
import mainCss from '../styles/main.css';
export const links = () => [{ rel: 'stylesheet', href: mainCss }];

const gjsOptions: EditorConfig = {
  height: '100vh',
  storageManager: false,
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  projectData: {
    assets: [
      'https://via.placeholder.com/350x250/78c5d6/fff',
      'https://via.placeholder.com/350x250/459ba8/fff',
      'https://via.placeholder.com/350x250/79c267/fff',
      'https://via.placeholder.com/350x250/c5d647/fff',
      'https://via.placeholder.com/350x250/f28c33/fff',
    ],
    pages: [
      {
        name: 'Home page',
        component: `<h1>GrapesJS React Custom UI</h1>`,
      },
    ],
  },
};

export default function App() {
  const onEditor = (editor: any) => {
    console.log('Editor loaded');
    (window as any).editor = editor;
  };

  return (
    <>
      <GjsEditor
        className="gjs-custom-editor text-white bg-slate-900"
        grapesjs="https://unpkg.com/grapesjs"
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        options={gjsOptions}
        plugins={[
          {
            id: 'gjs-blocks-basic',
            src: 'https://unpkg.com/grapesjs-blocks-basic',
          },
        ]}
        onEditor={onEditor}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{ flex: '1 1 auto' }}
            className="gjs-column-m flex flex-col flex-grow"
          >
            <Topbar className="min-h-[48px]" />
            <div style={{ flex: '1 1 auto' }}>
              <Card>
                <Canvas />
              </Card>
            </div>
          </div>
          <RightSidebar
            className={`gjs-column-r w-[300px] border-l ${MAIN_BORDER_COLOR}`}
          />
        </div>
      </GjsEditor>
    </>
  );
}
