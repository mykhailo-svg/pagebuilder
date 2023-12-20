import type { Selector, State, StyleTarget } from "grapesjs";
import { BlockStack, Button, InlineGrid, Text, Select as PolarisSelect, Popover, FormLayout, TextField, Select } from "@shopify/polaris";
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


  const targetStr = targets.join(", ");

  const [statessOptions, setStatesOptions] = useState([{ label: "- State -", value: "", id: '' }])

  useEffect(() => {
    setStatesOptions([{ label: "- State -", value: "", id: '' },
    ...states.map((state) => { return { label: state.getLabel(), value: state.id.toString(), id: state.id.toString() } })])

  }, [states])

  const [popoverActive, setPopoverActive] = useState(false);
  const [tagValue, setTagValue] = useState('');

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const handleTagValueChange = useCallback(
    (value: string) => setTagValue(value),
    [],
  );

  const activator = (
    <Button variant="primary" fullWidth onClick={togglePopoverActive} disclosure>
      Selector
    </Button>
  );
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
          <Popover preferredPosition="above"
            active={popoverActive}
            activator={activator}
            onClose={togglePopoverActive}
            ariaHaspopup={false}
            sectioned
          >
            <BlockStack gap="300">
              <TextField
                label="Selector"
                value={tagValue}
                onChange={handleTagValueChange}
                autoComplete="off"
              />
              <Button size="slim" onClick={() => {
                addSelector({ name: tagValue, label: tagValue });
              }}>Add selector</Button>
            </BlockStack>
          </Popover>
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
