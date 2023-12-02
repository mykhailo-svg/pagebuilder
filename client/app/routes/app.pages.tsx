import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  LegacyCard,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
} from '@shopify/polaris';
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
    <LegacyCard>
      <ResourceList
        resourceName={{ singular: 'customer', plural: 'customers' }}
        items={[
          {
            id: '100',
            url: '#',
            name: 'Mae Jemison',
            location: 'Decatur, USA',
          },
          {
            id: '200',
            url: '#',
            name: 'Ellen Ochoa',
            location: 'Los Angeles, USA',
          },
        ]}
        renderItem={(item) => {
          const { id, url, name, location } = item;
          const media = <Avatar customer size="md" name={name} />;

          return (
            <ResourceItem
              id={id}
              url={url}
              media={media}
              accessibilityLabel={`View details for ${name}`}
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {name}
              </Text>
              <div>{'sdds'}</div>
            </ResourceItem>
          );
        }}
      />
    </LegacyCard>
  );
}
