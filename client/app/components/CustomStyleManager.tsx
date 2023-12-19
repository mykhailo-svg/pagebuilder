import * as React from 'react';
import { StylesResultProps } from '@grapesjs/react';
import { mdiMenuDown } from '@mdi/js';
import Icon from '@mdi/react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { MAIN_BG_COLOR } from './common';
import StylePropertyField from './StylePropertyField';
import { Sectors } from 'grapesjs';
import { BlockStack, Button, Collapsible, Scrollable, Text } from '@shopify/polaris';
import { StyleAccordion } from './CustomStyleAccordion';

const accordionIcon = <Icon path={mdiMenuDown} size={0.7} />;

export default function CustomStyleManager({ sectors }: { sectors: Sectors }) {
  const [open, setOpen] = React.useState(true);

  const handleToggle = React.useCallback(() => setOpen((open) => !open), []);
  return (
    <Scrollable style={{ height: "500px" }}>
      <BlockStack gap="400">
        {sectors.map((sector) => (
          <>
            <StyleAccordion sector={sector} />
          </>
        ))}
      </BlockStack>
    </Scrollable>
  );
}
