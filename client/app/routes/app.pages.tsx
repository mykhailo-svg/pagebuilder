import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  Card,
  Page,
  EmptyState,
  InlineGrid,
  ResourceListProps,
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

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps['selectedItems']
  >([]);

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const items = [
    {
      id: '103',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
    },
    {
      id: '203',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
    },
  ];

  const promotedBulkActions = [
    {
      content: 'Edit customers',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const bulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      content: 'Delete customers',
      onAction: () => console.log('Todo: implement bulk delete'),
    },
  ];

  return (
    <Page>
      <ui-title-bar title="Pages"></ui-title-bar>
      <Card>
        {response.length ? (
          <ResourceList
            resourceName={{ singular: 'customer', plural: 'customers' }}
            items={response}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            selectable
            renderItem={(item) => {
              const { id, name, status, templateType } = item;

              return (
                <ResourceItem
                  id={id}
                  url={`/app/editor?pageId=${id}`}
                  accessibilityLabel={`View details for ${name}`}
                >
                  <InlineGrid columns={3}>
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                      {name}
                    </Text>
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                      {templateType}
                    </Text>
                    <Badge
                      tone={definePageBadgesStatus(status).tone}
                      progress={definePageBadgesStatus(status).progress}
                    >
                      {definePageBadgesStatus(status).text}
                    </Badge>
                  </InlineGrid>
                </ResourceItem>
              );
            }}
          />
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
