import type { ActionFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { Form, useActionData, useSubmit } from '@remix-run/react';
import { useRef } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  return json(body.get('arbitraryData'));
}

export default function Todos() {
  console.log(useActionData());
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null); //Add a form ref.
  const handleSubmit = (event: any) => {
    console.log(formRef.current);

    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.set('arbitraryData', 'sds2dfsfa');

    submit(
      formData, //Notice this change
      { method: 'post', action: '/app/asset' }
    );
  };
  return (
    <div>
      <Form ref={formRef} method="post" onSubmit={handleSubmit}>
        <input type="text" name="title" />
        <button type="submit">Create Todo</button>
      </Form>
    </div>
  );
}
