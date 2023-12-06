import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useSubmit } from '@remix-run/react';
import { useRef } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const arbitraryData = formData.get('arbitraryData');

  return json(arbitraryData);
}

export default function Todos() {
  console.log(useActionData());

  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('arbitraryData', 'sd1');

    submit(formData, { method: 'post', action: '/app/asset' });
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
