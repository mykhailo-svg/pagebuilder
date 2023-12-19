import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectOption, Selector, State, StyleTarget } from "grapesjs";
import { BlockStack, Button, InlineGrid, Text, Select as PolarisSelect } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";

type CustomSelectorManagerProps = {
  selectors: Selector[];
  selectedState: string; states: State[];
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

  useEffect(() => {
    setStatesOptions([{ label: "- State -", value: "", id: '' },
    ...states.map((state) => { return { label: state.getLabel(), value: state.id.toString(), id: state.id.toString() } })])

  }, [states])

  const options = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'lastWeek' },
  ];
  return (
    <div className="gjs-custom-selector-manager p-2 flex flex-col gap-2 text-left">
      <div className="flex items-center">
        <PolarisSelect
          label="Selectors"
          options={statessOptions}
          onChange={(e) => setState(e)}
          value={selectedState}
        />
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
