import { useNavigate } from '@remix-run/react';
import {
  Badge,
  ButtonGroup,
  FullscreenBar,
  Button,
  Text,
  InlineGrid,
  InlineStack,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { PageType } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';

export function EditorHeader({ page }: { page: PageType }) {
  const [isFullscreen, setFullscreen] = useState(true);
  const navigate = useNavigate();

  const handleActionClick = useCallback(() => {
    navigate('/app/pages');
  }, []);

  return (
    <FullscreenBar onAction={handleActionClick}>
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        <InlineStack gap="100">
          <Badge
            size="small"
            tone={definePageBadgesStatus(page.status).tone}
            progress={definePageBadgesStatus(page.status).progress}
          >
            {definePageBadgesStatus(page.status).text}
          </Badge>
          <Badge tone="info">{page.templateType}</Badge>
        </InlineStack>
        <div style={{ marginLeft: '1rem', flexGrow: 1 }}>
          <InlineGrid gap="1000">
            <Text variant="headingLg" as="p">
              {page.name}
            </Text>
          </InlineGrid>
        </div>
        <ButtonGroup>
          <Button onClick={() => {}}>Secondary Action</Button>
          <Button variant="primary" onClick={() => {}}>
            Primary Action
          </Button>
        </ButtonGroup>
      </div>
    </FullscreenBar>
  );
}
