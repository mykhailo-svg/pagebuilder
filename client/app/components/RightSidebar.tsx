import * as React from 'react';
import {
  BlocksProvider,
  LayersProvider,
  SelectorsProvider,
  StylesProvider,
  TraitsProvider,
} from '@grapesjs/react';
import { Tabs, Card } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import CustomBlockManager from './CustomBlockManager';
import CustomLayerManager from './CustomLayerManager';
import CustomSelectorManager from './CustomSelectorManager';
import CustomStyleManager from './CustomStyleManager';
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
    <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
        {panels[selected]}
      </Tabs>
    </Card>
  );
}
