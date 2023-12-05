import { Badge, BlockStack, Card, InlineGrid, Text } from '@shopify/polaris';
import { useEffect, useRef } from 'react';
import type { PagePublishStatus } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';

export function Sidebar({
  pageName,
  pageStatus,
}: {
  pageName: string;
  pageStatus: PagePublishStatus;
}) {
  useEffect(() => {
    console.log('sd');
  }, []);
  const blocksRef = useRef<null | HTMLDivElement>(null);
  const stylesRef = useRef<null | HTMLDivElement>(null);
  if (blocksRef.current && blocksRef.current.children.length === 2) {
    blocksRef.current.children[0].outerHTML = '';
  }
  if (stylesRef.current?.children.length === 4) {
    console.log(stylesRef.current.children);

    stylesRef.current.children[0].outerHTML = '';
    stylesRef.current.children[0].outerHTML = '';
  }

  return (
    <>
      <div style={{ width: '300px' }}>
        <Card>
          <BlockStack gap="1000">
            <Card>
              <InlineGrid columns={2}>
                <Text truncate as="h4">
                  {pageName}
                </Text>
                <Badge
                  size="small"
                  tone={definePageBadgesStatus(pageStatus).tone}
                  progress={definePageBadgesStatus(pageStatus).progress}
                >
                  {definePageBadgesStatus(pageStatus).text}
                </Badge>
              </InlineGrid>
            </Card>
            <BlockStack gap="500">
              <Text as="h5">Blocks</Text>
              <div id="blocks" ref={blocksRef}></div>
            </BlockStack>
            {/* <BlockStack gap="500">
              <Text as="h5">Layers</Text>
              <div id="layers-container"></div>
            </BlockStack> */}
            <BlockStack gap="500">
              <Text as="h5">Styles</Text>
              <div ref={stylesRef} id="styles-container"></div>
            </BlockStack>
          </BlockStack>
        </Card>
      </div>
    </>
  );
}
