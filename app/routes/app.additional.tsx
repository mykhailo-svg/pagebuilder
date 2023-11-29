import React, { useState, useEffect } from 'react';
import { BlockStack, Button, Card, Grid, Layout, Page } from '@shopify/polaris';
import { generateId } from '~/helpers/generateId';

export default function AdditionalPage() {
  const [markdown, setMarkdown] = useState<string>(
    `<div class="${generateId()}" >Hii<div>no</div></div>`
  );

  const handleContentClick = (e: any) => {
    e.stopPropagation();
    alert(e.target.textContent);
    console.log(e.target);
  };

  return (
    <Page fullWidth>
      <ui-title-bar title="Page Builder" />
      <Layout>
        <Layout.Section>
          <Grid>
            <Card>
              <div
                dangerouslySetInnerHTML={{ __html: markdown }}
                onClick={handleContentClick}
              />
            </Card>
            <Card>sd</Card>
          </Grid>
        </Layout.Section>
      </Layout>
      <Page fullWidth>
        <Grid
          columns={{ xs: 1, sm: 4, md: 4, lg: 6, xl: 6 }}
          areas={{
            xs: ['product', 'sales', 'orders'],
            sm: [
              'product product product product',
              'sales sales orders orders',
            ],
            md: ['sales product product orders'],
            lg: ['product product product product sales orders'],
            xl: ['product product sales sales orders orders'],
          }}
        >
          <Grid.Cell area="product">
            <Card>dfgdsl;gs;l</Card>
          </Grid.Cell>
          <Grid.Cell area="sales">
            <Card>dfgdsl;gs;l</Card>
          </Grid.Cell>
        </Grid>
      </Page>
    </Page>
  );
}
