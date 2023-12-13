import {
  Badge,
  ButtonGroup,
  Button,
  Text,
  InlineGrid,
  InlineStack,
  Card,
} from '@shopify/polaris';
import { MaximizeMajor } from '@shopify/polaris-icons';
import type { PageType } from '~/global_types';
import { definePageBadgesStatus } from '~/helpers/definePageBadge';

export function EditorHeader({
  page,
  canSave,
  handleFullscreenToggle,
}: {
  page: PageType;
  canSave: boolean;
  handleFullscreenToggle: () => void;
}) {
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
          gap: '20px',
        }}
      >
        <Button onClick={handleFullscreenToggle} icon={MaximizeMajor} />
        <InlineStack gap="500">
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
        </ButtonGroup>
      </div>
    </Card>
  );
}
