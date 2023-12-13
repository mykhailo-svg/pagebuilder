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
import { useRef, useState } from 'react';
import type { PageType } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';
import { deletePages, getPages } from '~/models/page.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '0');
  try {
    const pages = await getPages({ page });

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
  const response = useLoaderData<{
    pages: PageType[];
    hasNext: boolean;
    hasPrevious: boolean;
  }>();
  console.log(response);

  const resourceName = {
    singular: 'page',
    plural: 'pages',
  };

  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    selectedResources,
    clearSelection,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(response.pages);

  const handleSubmit = (event: any) => {
    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('liquidName', JSON.stringify(selectedResources));
    submit(formData, {
      method: 'post',
      action: `/app/pages`,
    });
  };

  const [pageCount, setPageCount] = useState(0);

  const rowMarkup = response.pages.map(
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
        setPageCount(0);
        clearSelection();
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
          {response.pages.length ? (
            <IndexTable
              resourceName={resourceName}
              itemCount={response.pages.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: 'Name' },
                { title: 'Template' },
                { title: 'Status' },
              ]}
              pagination={{
                hasNext: response.hasNext,
                nextURL: `/app/pages?page=${pageCount + 1}`,
                onNext: () => {
                  setPageCount(pageCount + 1);
                },
                previousURL: `/app/pages?page=${pageCount - 1}`,
                hasPrevious: response.hasPrevious,
                onPrevious: () => {
                  if (pageCount) {
                    setPageCount(pageCount - 1);
                  }
                },
              }}
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
