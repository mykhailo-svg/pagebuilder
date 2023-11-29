import React, { useState, useEffect } from 'react';
import { Layout, Page } from '@shopify/polaris';

export default function AdditionalPage() {
  const [markdown, setMarkdown] = useState<string>('<div>Hii</div>');

  useEffect(() => {
    // Перевірка, чи код виконується на клієнтській стороні
    if (typeof window !== 'undefined') {
      console.log(new DOMParser().parseFromString(markdown, 'text/html'));
    }
  }, [markdown]);

  return (
    <Page>
      <ui-title-bar title="Page Builder" />
      <Layout>
        <div dangerouslySetInnerHTML={{ __html: markdown }} />
      </Layout>
    </Page>
  );
}
