import React, { useState, useEffect } from 'react';
import { Button, Layout, Page } from '@shopify/polaris';
import { generateId } from '~/helpers/generateId';

export default function AdditionalPage() {
  const [markdown, setMarkdown] = useState<string>(
    `<div class="${generateId()}" >Hii<div>no</div></div>`
  );

  const handleContentClick = (e: any) => {
    e.stopPropagation();
    alert(e.target.textContent);
  };

  return (
    <Page>
      <ui-title-bar title="Page Builder" />
      <Layout>
        <div
          dangerouslySetInnerHTML={{ __html: markdown }}
          onClick={handleContentClick}
        />
      </Layout>
    </Page>
  );
}
