import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Page, Layout, Button } from '@shopify/polaris';
import { authenticate } from '~/shopify.server';

import resource from '../constants/product.json' assert { type: 'json' };

export const action = async ({ request }: ActionFunctionArgs) => {
  const name = 'custom';
  const newResource: any = resource;
  const { admin, session } = await authenticate.admin(request);
  const asset = new admin.rest.resources.Asset({ session: session });
  asset.theme_id = 163021127986;

  // 163021127986;
  // 131827335324;

  asset.key = `sections/${name}.liquid`;
  asset.value =
    "<div><img src='backsoon-postit.png'><p>We are busy updating the store for you and will be back within the hour.</p></div>";
  await asset.save();

  const tpl = new admin.rest.resources.Asset({ session: session });
  tpl.theme_id = 163021127986;

  tpl.key = `templates/product.${name}.json`;
  newResource.sections[name] = {
    type: name,
    settings: {},
  };
  newResource.order.push(name);
  tpl.value = JSON.stringify(resource);
  await tpl.save();
  return json({
    asset,
    tpl,
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
