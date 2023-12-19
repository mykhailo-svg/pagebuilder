import * as React from "react";
import { SelectorsResultProps } from "@grapesjs/react";
import { mdiClose, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { MAIN_BORDER_COLOR, cx } from "./common";
import { Selector, State, StyleTarget } from "grapesjs";
import { BlockStack, Button, InlineGrid, InlineStack, Text } from "@shopify/polaris";

type CustomSelectorManagerProps = {
  selectors: Selector[];
  selectedState: State; states: State[];
  targets: StyleTarget[]; setState: (val: any) => void, addSelector: (props: any) => void
  removeSelector: (arg: any) => void
}

export default function CustomSelectorManager({
  selectors,
  selectedState,
  states,
  targets,
  setState,
  addSelector,
  removeSelector,
}: CustomSelectorManagerProps) {
  const addNewSelector = () => {
    const next = selectors.length + 1;
    addSelector({ name: `new-${next}`, label: `New ${next}` });
  };

  const targetStr = targets.join(", ");

  return (
    <div className="gjs-custom-selector-manager p-2 flex flex-col gap-2 text-left">
      <div className="flex items-center">
        <div className="flex-grow">Selectors</div>
        <FormControl size="small">
          <Select
            value={selectedState}
            onChange={(ev) => setState(ev.target.value)}
            displayEmpty
          >
            <MenuItem value="">- State -</MenuItem>
            {states.map((state) => (
              <MenuItem value={state.id} key={state.id}>
                {state.getName()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        {targetStr ? (
          <Button variant="primary" onClick={addNewSelector}>Add</Button>
        ) : (
          <div className="opacity-70">Select a component</div>
        )}
        <BlockStack gap="100">
          {selectors.map((selector) => (
            <InlineGrid columns={2}>

              <div>{selector.getLabel()}</div>
              <Button variant="primary" tone="critical" onClick={() => removeSelector(selector)}>Remove</Button>
            </InlineGrid >

          ))}
        </BlockStack>
      </div>
      <div>
        Selected: <Text as="span">{targetStr || "None"}</Text>
      </div>
    </div>
  );
}
