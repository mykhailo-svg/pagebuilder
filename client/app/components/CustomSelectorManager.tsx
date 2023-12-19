import type { Selector, State, StyleTarget } from "grapesjs";
import { BlockStack, Button, InlineGrid, Text, Select as PolarisSelect } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteMajor
} from '@shopify/polaris-icons';

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

  console.log(states);
  const [statessOptions, setStatesOptions] = useState([{ label: "- State -", value: "", id: '' }])

  useEffect(() => {
    setStatesOptions([{ label: "- State -", value: "", id: '' },
    ...states.map((state) => { return { label: state.getLabel(), value: state.id.toString(), id: state.id.toString() } })])

  }, [states])


  return (
    <BlockStack gap="500">
      <BlockStack gap="100">
        <PolarisSelect
          label="Selectors"
          options={statessOptions}
          onChange={(e) => setState(e)}
          value={selectedState}
        />
        {targetStr ? (
          <Button variant="primary" fullWidth onClick={addNewSelector}>Add</Button>
        ) : (
          <div className="opacity-70">Select a component</div>
        )}
      </BlockStack>
      <div>

        <BlockStack gap="100">
          {selectors.map((selector) => (
            <InlineGrid columns={2}>

              <div>{selector.getLabel()}</div>
              <Button variant="primary" tone="critical" onClick={() => removeSelector(selector)} icon={DeleteMajor} />
            </InlineGrid >

          ))}
        </BlockStack>
      </div>
      <div>
        Selected: <Text as="span">{targetStr || "None"}</Text>
      </div>
    </BlockStack>
  );
}
