import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  ResourceList,
  ResourceItem,
  IndexTable,
  Text,
  Badge,
  Card,
  Page,
  EmptyState,
  useIndexResourceState,
  InlineGrid,
  ResourceListProps,
  Link,
  Button,
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

  const orders = [
    {
      id: '1020',
      order: '#1020',
      date: 'Jul 20 at 4:34pm',
      customer: 'Jaydon Stanton',
      total: '$969.44',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1019',
      order: '#1019',
      date: 'Jul 20 at 3:46pm',
      customer: 'Ruben Westerfelt',
      total: '$701.19',
      paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: '1018',
      order: '#1018',
      date: 'Jul 20 at 3.44pm',
      customer: 'Leo Carder',
      total: '$798.24',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
  ];

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (
      { id, order, date, customer, total, paymentStatus, fulfillmentStatus },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Link url="/app/" dataPrimaryLink>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {order}
            </Text>
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>{total}</IndexTable.Cell>
        <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
        <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );
  const promotedBulkActions = [
    {
      content: 'Create shipping labels',
      onAction: () => console.log('Todo: implement create shipping labels'),
    },
    {
      content: 'Mark as fulfilled',
      onAction: () => console.log('Todo: implement mark as fulfilled'),
    },
    {
      content: 'Capture payment',
      onAction: () => console.log('Todo: implement capture payment'),
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
          // <ResourceList
          //   resourceName={{ singular: 'customer', plural: 'customers' }}
          //   items={response}
          //   selectedItems={selectedItems}
          //   onSelectionChange={setSelectedItems}
          //   selectable
          //   renderItem={(item) => {
          //     const { id, name, status, templateType } = item;

          //     return (
          //       <ResourceItem
          //         id={id}
          //         url={`/app/editor?pageId=${id}`}
          //         accessibilityLabel={`View details for ${name}`}
          //       >
          //         <InlineGrid columns={3}>
          //           <Text variant="bodyMd" fontWeight="bold" as="h3">
          //             {name}
          //           </Text>
          //           <Text variant="bodyMd" fontWeight="bold" as="h3">
          //             {templateType}
          //           </Text>
          //           <Badge
          //             tone={definePageBadgesStatus(status).tone}
          //             progress={definePageBadgesStatus(status).progress}
          //           >
          //             {definePageBadgesStatus(status).text}
          //           </Badge>
          //         </InlineGrid>
          //       </ResourceItem>
          //     );
          //   }}
          // />
          <IndexTable
            resourceName={resourceName}
            itemCount={orders.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            hasMoreItems
            bulkActions={bulkActions}
            promotedBulkActions={promotedBulkActions}
            headings={[
              { title: 'Order' },
              { title: 'Date' },
              { title: 'Customer' },
              { title: 'Total', alignment: 'end' },
              { title: 'Payment status' },
              { title: 'Fulfillment status' },
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
