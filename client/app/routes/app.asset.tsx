import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Page, Layout, Button } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const asset = new admin.rest.resources.Asset({ session: session });
  asset.theme_id = 163021127986;

  // 163021127986;
  // 131827335324;

  asset.key = 'sections/a2.liquid';
  asset.value =
    "<div><img src='backsoon-postit.png'><p>We are busy updating the store for you and will be back within the hour.</p></div>";
  await asset.save();
  return json({
    asset,
  });
};

export default function Index() {
  const response = useActionData();
  console.log(response);

  return (
    <Page>
      <ui-title-bar title="Main page"></ui-title-bar>
      <Layout>
        <Form method="put">
          <Button submit>Submit</Button>
        </Form>
      </Layout>
    </Page>
  );
}
