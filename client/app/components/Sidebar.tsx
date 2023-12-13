import { BlockStack, Card, Text } from '@shopify/polaris';
import { useEffect, useRef } from 'react';

export function Sidebar() {
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
      <div style={{ width: '300px', height: '80vh', overflow: 'auto' }}>
        <Card>
          <BlockStack gap="1000">
            <BlockStack gap="500">
              <Text as="h5">Blocks</Text>
              <div id="blocks" ref={blocksRef}></div>
            </BlockStack>
            <BlockStack gap="500">
              <Text as="h5">Layers</Text>
              <div id="layers-container"></div>
            </BlockStack>
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
