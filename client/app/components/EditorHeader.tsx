import { useNavigate } from '@remix-run/react';
import {
  Badge,
  ButtonGroup,
  FullscreenBar,
  Button,
  Text,
  InlineGrid,
  InlineStack,
  Card,
} from '@shopify/polaris';
import type { PageType } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';

export function EditorHeader({
  page,
  canSave,
}: {
  page: PageType;
  canSave: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Card>
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
        <InlineStack gap="500">
          <Button url="/app/pages">Back</Button>
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
          <Button
            disabled={canSave}
            submit
            variant="primary"
            onClick={() => {}}
          >
            {page.shouldPublish ? 'Publish' : 'Save'}
          </Button>
          <Button variant="primary" tone="critical" onClick={() => {}}>
            Delete
          </Button>
        </ButtonGroup>
      </div>
    </Card>
  );
}
