import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  IndexTable,
  Text,
  Badge,
  Card,
  Page,
  EmptyState,
  useIndexResourceState,
  ResourceListProps,
  Link,
} from '@shopify/polaris';
import { useState } from 'react';
import type { PageType } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';
import { getPages } from '~/models/page.server';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const pages = await getPages();

    return json(pages);
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function Pages() {
  const response = useLoaderData<PageType[]>();

  const resourceName = {
    singular: 'page',
    plural: 'pages',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(response);

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
      onAction: () => console.log('Todo: implement create shipping labels'),
    },
  ];

  return (
    <Page>
      <ui-title-bar title="Pages"></ui-title-bar>
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
    </Page>
  );
}
