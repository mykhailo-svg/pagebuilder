import { Page, Layout, CalloutCard } from '@shopify/polaris';

export default function Index() {
  return (
    <Page fullWidth>
      <ui-title-bar title="Main page"></ui-title-bar>
      <Layout>
        <CalloutCard
          title="Build drag-n-drop pages with no code!"
          illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
          primaryAction={{
            content: 'Start creating!',
            url: '/app/createPage',
          }}
          secondaryAction={{
            content: 'View pages...',
            url: '/app/pages',
          }}
        >
          <p>
            Be warmed up for new updates! Build your dream store with page
            builder
          </p>
        </CalloutCard>
      </Layout>
    </Page>
  );
}
