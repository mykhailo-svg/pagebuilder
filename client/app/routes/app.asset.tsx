import { ActionFunctionArgs, redirect, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Page, Layout, Button, ButtonGroup } from '@shopify/polaris';
import axios from 'axios';
export const action = async ({ request }: ActionFunctionArgs) => {
  return json({
    sf: 'sdsd',
  });
};

export default function Index() {
  const response = useActionData();
  console.log(response);

  return (
    <Page>
      <ui-title-bar title="Main page"></ui-title-bar>
      <Layout>
        <Form method="post">
          <Button submit>Submit</Button>
        </Form>
      </Layout>
    </Page>
  );
}
