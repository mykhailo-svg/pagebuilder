import { Page, Layout, Card, Button, ButtonGroup } from '@shopify/polaris';

export default function Index() {
  return (
    <Page>
      <ui-title-bar title="Main page"></ui-title-bar>
      <Layout>
        <ButtonGroup>
          <Button>View pages</Button>
          <Button variant="primary">Create page</Button>
        </ButtonGroup>
      </Layout>
    </Page>
  );
}
