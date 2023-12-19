import * as React from 'react';
import { StylesResultProps } from '@grapesjs/react';
import { mdiMenuDown } from '@mdi/js';
import Icon from '@mdi/react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { MAIN_BG_COLOR } from './common';
import StylePropertyField from './StylePropertyField';
import { Sector, Sectors } from 'grapesjs';
import { Button, Collapsible, Text } from '@shopify/polaris';
import { useCallback, useState } from 'react';

const accordionIcon = <Icon path={mdiMenuDown} size={0.7} />;

export function StyleAccordion({ sector }: { sector: Sector }) {
    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);
    return (

        <div>
            <Button fullWidth onClick={handleToggle}>
                {sector.getName()}
            </Button>


            <Collapsible
                open={open}
                id="basic-collapsible"
                transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                expandOnPrint
            >
                {sector.getProperties().map((prop) => (
                    <StylePropertyField key={prop.getId()} prop={prop} />
                ))}
            </Collapsible>
        </div>

    );
}
