import * as React from 'react';
import {
  BlocksProvider,
  LayersProvider,
  PagesProvider,
  SelectorsProvider,
  StylesProvider,
  TraitsProvider,
} from '@grapesjs/react';
import {
  mdiBrush,
  mdiLayers,
  mdiViewGridPlus,
  mdiTextBoxMultiple,
  mdiCog,
} from '@mdi/js';
import {
  LegacyCard,
  Tabs as PolarisTabs,
  Icon as PolarisIcon,
} from '@shopify/polaris';
import Icon from '@mdi/react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useCallback, useState } from 'react';
import CustomBlockManager from './CustomBlockManager';
import { MAIN_BORDER_COLOR, cx } from './common';
import CustomPageManager from './CustomPageManager';
import CustomLayerManager from './CustomLayerManager';
import CustomSelectorManager from './CustomSelectorManager';
import CustomStyleManager from './CustomStyleManager';
import { PaintBrushMajor } from '@shopify/polaris-icons';
import CustomTraitManager from './CustomTraitManager';

const defaultTabProps = {
  className: '!min-w-0',
};

export default function RightSidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedTab, setSelectedTab] = useState(0);
  const panels = [
    <>
      <SelectorsProvider>
        {(props) => <CustomSelectorManager {...props} />}
      </SelectorsProvider>
      <StylesProvider>
        {(props) => <CustomStyleManager {...props} />}
      </StylesProvider>
    </>,
    <>
      <TraitsProvider>
        {(props) => <CustomTraitManager {...props} />}
      </TraitsProvider>
    </>,
    <>
      <LayersProvider>
        {(props) => <CustomLayerManager {...props} />}
      </LayersProvider>
    </>,
    <>
      <BlocksProvider>
        {(props) => <CustomBlockManager {...props} />}
      </BlocksProvider>
    </>,
  ];
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  );
  const tabs = [
    {
      id: 'all-customers-fitted-2',
      content: 'Styles',
      accessibilityLabel: 'All customers',
      panelID: 'styles',
    },
    {
      id: 'accepts-marketing-fitted-2',
      content: 'Settings',

      panelID: 'settings',
    },
    {
      id: 'layers',
      content: 'Layers',

      panelID: 'layers',
    },
    {
      id: 'blocks',
      content: 'Blocks',

      panelID: 'blocks',
    },
  ];
  return (
    <div className={cx('gjs-right-sidebar flex flex-col', className)}>
      <PolarisTabs
        tabs={tabs}
        selected={selected}
        onSelect={handleTabChange}
        fitted
      >
        {panels[selected]}
      </PolarisTabs>
    </div>
  );
}
