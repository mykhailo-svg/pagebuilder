//@ts-nocheck
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
  const [GjsEditor, setGjsEditor] = useState<any>(null);

  useEffect(() => {
    const loadGrapesJS = async () => {
      try {
        // Dynamically import GrapesJS and its related modules
        const [
          Editor,
          GjsEditor,
          GjsEditorModule,

          // Other modules...
        ] = await Promise.all([
          import('grapesjs'),
          import('@grapesjs/react'),

          // Import other modules dynamically...
        ]);

        // Set up GrapesJS options and other configurations...
        const gjsOptions = {
          // Your GrapesJS options...
        };

        // Your onEditor function...
        const onEditor = (editor: any) => {
          console.log('Editor loaded');
          (window as any).editor = editor;
        };

        // Set the GjsEditor component with the dynamically imported module
        setGjsEditor(() => (
          <GjsEditor.default
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
            {/* Your JSX structure... */}
          </GjsEditor.default>
        ));
      } catch (error) {
        console.error('Error loading GrapesJS:', error);
      }
    };

    // Call the function to load GrapesJS when the component mounts
    loadGrapesJS();
  }, []); // Empty dependency array to ensure the effect runs only once

  return <>{GjsEditor}</>;
}
