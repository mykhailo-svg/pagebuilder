import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  LegacyCard,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  Badge,
  Card,
  Page,
} from '@shopify/polaris';
import { Progress, Tone } from '@shopify/polaris/build/ts/src/components/Badge';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { authenticate } from '~/shopify.server';
type PageType = {
  id: string;
  css: string;
  html: string;
  themeId: string;
  shop: string;
  isPublished: boolean;
  isInShopify: boolean;
};

type InitialLoaderResponse = {
  pagesData: PageType[];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const pageId = url.searchParams.get('pageId') || '';
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
        <ResourceList
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={pages}
          renderItem={(item) => {
            const { id, shop, isPublished } = item;
            const publishTone: Tone = isPublished ? 'success' : 'attention';
            const publishProgress: Progress = isPublished
              ? 'complete'
              : 'incomplete';
            const badgeText = isPublished ? 'Published' : 'Not published';
            return (
              <ResourceItem
                id={id}
                url={`/app/additional?pageId=${id}`}
                accessibilityLabel={`View details for ${name}`}
              >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {id}
                </Text>
                <Badge tone={publishTone} progress={publishProgress}>
                  {badgeText}
                </Badge>
                <div>{shop}</div>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </Page>
  );
}
