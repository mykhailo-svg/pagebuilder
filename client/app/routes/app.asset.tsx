import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Page, Layout, Button } from '@shopify/polaris';
import { Fullscreen } from '@shopify/app-bridge/actions';
import { authenticate } from '~/shopify.server';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useEffect } from 'react';
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const asset = new admin.rest.resources.Asset({ session: session });
  asset.theme_id = 131827335324;
  asset.key = 'templates/olol.liquid';
  asset.value =
    "<img src='backsoon-postit.png'><p>We are busy updating the store for you and will be back within the hour.</p>";
  await asset.save();
  return json({
    asset,
  });
};

export default function Index() {
  const response = useActionData();
  console.log(response);
  const app = useAppBridge();
  useEffect(() => {
    if (app) {
      const fullscreen = Fullscreen.create(app);
      fullscreen.dispatch(Fullscreen.Action.ENTER);
    }
  }, [app]);
  return (
    <Page>
      <ui-title-bar title="Main page"></ui-title-bar>
      <Layout>
        <Form method="put">
          <Button
            onClick={() => {
              const fullscreen = Fullscreen.create(app);
              fullscreen.dispatch(Fullscreen.Action.EXIT);
            }}
          >
            Submit
          </Button>
        </Form>
      </Layout>
    </Page>
  );
}
