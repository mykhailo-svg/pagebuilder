import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectOption, Selector, State, StyleTarget } from "grapesjs";
import { BlockStack, Button, InlineGrid, Text, Select as PolarisSelect } from "@shopify/polaris";
import { useCallback, useState } from "react";

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
  const [selected, setSelected] = useState('today');

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );
  console.log(states);
  const [statessOptions, setStatesOptions] = useState([{ label: "- State -", value: "", id: '' }])


  const options = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'lastWeek' },
  ];
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
        <PolarisSelect
          label="Date range"
          options={statessOptions}
          onChange={handleSelectChange}
          value={selected}
        />
        {states.length}
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
