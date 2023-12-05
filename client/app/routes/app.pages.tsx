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
} from '@shopify/polaris';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { PageType } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';
import { getPages } from '~/models/page.server';
import { authenticate } from '~/shopify.server';

type InitialLoaderResponse = {
  pagesData: PageType[];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const pages = await getPages();

    return json(pages);
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function Pages() {
  const [pages, setPages] = useState<PageType[]>([
    {
      id: 'ssf',
      name: 'sdsd',
      css: 'df',
      html: 'fd',
      themeId: 'dfdfF',
      shouldPublish: false,
      shop: 'sd',
      status: 'neverPublished',
    },
  ]);
  const response = useLoaderData<PageType[]>();

  useEffect(() => {
    setPages(response);
  }, []);
  console.log(pages);

  return (
    <Page>
      <ui-title-bar title="Pages"></ui-title-bar>
      <Card>
        {response.length ? (
          <ResourceList
            resourceName={{ singular: 'customer', plural: 'customers' }}
            items={response}
            renderItem={(item) => {
              const { id, name, status } = item;

              return (
                <ResourceItem
                  id={id}
                  url={`/app/additional?pageId=${id}`}
                  accessibilityLabel={`View details for ${name}`}
                >
                  <InlineGrid columns={2}>
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                      {name}
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
