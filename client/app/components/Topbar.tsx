import * as React from 'react';
import { DevicesProvider, WithEditor } from '@grapesjs/react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { cx } from './common';
import TopbarButtons from './TopbarButtons';
import { DevicesProviderProps } from 'node_modules/@grapesjs/react/dist/DevicesProvider';
import { Device } from 'grapesjs';
import { Card, InlineGrid, InlineStack } from '@shopify/polaris';

export default function Topbar() {
  return (
    <Card>
      <InlineGrid columns={2} gap="1000">
        {/* <DevicesProvider>
          {({
            selected,
            select,
            devices,
          }: {
            devices: Device[];
            selected: any;
            select: any;
          }) => (
            <FormControl size="small">
              <Select
                value={selected}
                onChange={(ev) => select(ev.target.value)}
              >
                {devices.map((device) => (
                  <MenuItem value={device.id} key={device.id}>
                    {device.getName()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DevicesProvider> */}
        <WithEditor>
          <TopbarButtons className="ml-auto px-2" />
        </WithEditor>
      </InlineGrid>
    </Card>
  );
}
