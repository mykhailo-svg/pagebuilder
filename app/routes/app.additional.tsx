import { useState, useEffect } from 'react';
import { Page } from '@shopify/polaris';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginCkEditor from 'grapesjs-plugin-ckeditor';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
export const links = () => [{ rel: 'stylesheet', href: grapesStyles }];

export default function AdditionalPage() {
  const [editor, setEditor] = useState<any>(null);
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
    setEditor(editor);
  }, []);

  return (
    <Page fullWidth>
      <div id="editor"></div>
    </Page>
  );
}
