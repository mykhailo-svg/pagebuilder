import type { LoaderFunction, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from '@remix-run/react';
import {
  IndexTable,
  Text,
  Badge,
  Card,
  Page,
  EmptyState,
  useIndexResourceState,
  Link,
} from '@shopify/polaris';
import { BulkAction } from '@shopify/polaris/build/ts/src/components/BulkActions';
import { useRef } from 'react';
import type { PageType } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';
import { deletePages, getPages } from '~/models/page.server';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const pages = await getPages();

    return json(pages);
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const pages = await deletePages({
    ids: JSON.parse(formData.get('liquidName') as string),
  });

  return json({
    sd: pages,
  });
};

export default function Pages() {
  const response = useLoaderData<PageType[]>();

  const resourceName = {
    singular: 'page',
    plural: 'pages',
  };

  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(response);

  const handleSubmit = (event: any) => {
    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('liquidName', JSON.stringify(selectedResources));
    submit(formData, {
      method: 'post',
      action: `/app/pages`,
    });
  };

  const rowMarkup = response.map(
    ({ id, name, status, templateType }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Link url={`/app/editor?pageId=${id}`} dataPrimaryLink>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {name}
            </Text>
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>{templateType}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge
            tone={definePageBadgesStatus(status).tone}
            progress={definePageBadgesStatus(status).progress}
          >
            {definePageBadgesStatus(status).text}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );
  const promotedBulkActions = [
    {
      content: 'Delete pages',
      onAction: () => {
        handleSubmit(formRef.current);
      },
    },
  ];
  console.log(useActionData());

  return (
    <Page>
      <ui-title-bar title="Pages"></ui-title-bar>
      <Form ref={formRef} method="post">
        <Card>
          {response.length ? (
            <IndexTable
              resourceName={resourceName}
              itemCount={response.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              hasMoreItems
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: 'Name' },
                { title: 'Template' },
                { title: 'Status' },
              ]}
            >
              {rowMarkup}
            </IndexTable>
          ) : (
            <EmptyState
              heading="You don't have created pages"
              action={{ content: 'Create page +', url: '/app/createPage' }}
              secondaryAction={{
                content: 'Go to Dashboard',
                url: '/app',
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Create new page to start developing!</p>
            </EmptyState>
          )}
        </Card>
      </Form>
    </Page>
  );
}
