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
import type {
  Progress,
  Tone,
} from '@shopify/polaris/build/ts/src/components/Badge';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PagePublishStatus } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';
import { authenticate } from '~/shopify.server';
type PageType = {
  id: string;
  css: string;
  html: string;
  themeId: string;
  shop: string;
  name: string;
  status: PagePublishStatus;
  isPublished: boolean;
  isInShopify: boolean;
};

type InitialLoaderResponse = {
  pagesData: PageType[];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const pages = await axios
      .get(`http://localhost:4000/v1/page/created/test2r3`)
      .catch((error) => {
        console.error('Помилка відправлення POST-запиту:', error);
      });
    const pagesData = pages ? pages.data : null;

    return json({ pagesData });
  } catch (error) {
    console.error('Error fetching data:', error);

    return json([]);
  }
};

export default function Pages() {
  const [pages, setPages] = useState<PageType[]>([]);
  const response = useLoaderData<InitialLoaderResponse>();
  console.log(pages);

  useEffect(() => {
    setPages(response.pagesData);
  }, []);

  return (
    <Page>
      <ui-title-bar title="Pages"></ui-title-bar>
      <Card>
        {pages.length ? (
          <ResourceList
            resourceName={{ singular: 'customer', plural: 'customers' }}
            items={pages}
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
