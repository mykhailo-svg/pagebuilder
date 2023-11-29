import React, { useState, useEffect } from 'react';
import { BlockStack, Button, Card, Grid, Layout, Page } from '@shopify/polaris';
import { generateId } from '~/helpers/generateId';
import grapesjs from 'grapesjs';
import grapesStyles from 'grapesjs/dist/css/grapes.min.css';
export const links = () => [{ rel: 'stylesheet', href: grapesStyles }];

export default function AdditionalPage() {
  const [markdown, setMarkdown] = useState<string>(
    `<div class="${generateId()}" >Hii<div>no</div></div>`
  );

  const [editor, setEditor] = useState<any>(null);
  useEffect(() => {
    const editor = grapesjs.init({ container: '#editor' });
    setEditor(editor);
  }, []);

  const handleContentClick = (e: any) => {
    e.stopPropagation();
    alert(e.target.textContent);
    console.log(e.target);
  };

  return (
    <Page fullWidth>
      <div id="editor"></div>
    </Page>
  );
}
