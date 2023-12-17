import * as React from 'react';
import { useEditor } from '@grapesjs/react';
import { Icon as PolarisIcon } from '@shopify/polaris';
import type { Component } from 'grapesjs';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { cx } from './common';

export declare interface LayerItemProps
  extends React.HTMLProps<HTMLDivElement> {
  component: Component;
  level: number;
  draggingCmp?: Component;
  dragParent?: Component;
}
import {
  ChevronUpMinor,
  ChevronDownMinor,
  ViewMinor,
  HideMinor,
} from '@shopify/polaris-icons';

const itemStyle = { maxWidth: `100%` };

export default function LayerItem({
  component,
  draggingCmp,
  dragParent,
  ...props
}: LayerItemProps) {
  const editor = useEditor();
  const { Layers } = editor;
  const layerRef = useRef<HTMLDivElement>(null);
  const [layerData, setLayerData] = useState(Layers.getLayerData(component));
  const { open, selected, hovered, components, visible, name } = layerData;
  const componentsIds = components.map((cmp) => cmp.getId());
  const isDragging = draggingCmp === component;
  const cmpHash = componentsIds.join('-');
  const level = props.level + 1;
  const isHovered = hovered || dragParent === component;

  useEffect(() => {
    level === 0 && setLayerData(Layers.getLayerData(component));
    if (layerRef.current) {
      (layerRef.current as any).__cmp = component;
    }
  }, [component]);

  useEffect(() => {
    const up = (cmp: Component) => {
      cmp === component && setLayerData(Layers.getLayerData(cmp));
    };
    const ev = Layers.events.component;
    editor.on(ev, up);

    return () => {
      editor.off(ev, up);
    };
  }, [editor, Layers, component]);

  const cmpToRender = useMemo(() => {
    return components.map((cmp) => (
      <LayerItem
        key={cmp.getId()}
        component={cmp}
        level={level}
        draggingCmp={draggingCmp}
        dragParent={dragParent}
      />
    ));
  }, [cmpHash, draggingCmp, dragParent]);

  const toggleOpen = (ev: MouseEvent) => {
    ev.stopPropagation();
    Layers.setLayerData(component, { open: !open });
  };

  const toggleVisibility = (ev: MouseEvent) => {
    ev.stopPropagation();
    Layers.setLayerData(component, { visible: !visible });
  };

  const select = (event: MouseEvent) => {
    event.stopPropagation();
    Layers.setLayerData(component, { selected: true }, { event });
  };

  const hover = (hovered: boolean) => {
    if (!hovered || !draggingCmp) {
      Layers.setLayerData(component, { hovered });
    }
  };

  return (
    <div>
      <div
        onClick={select}
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        className="group max-w-full"
        data-layer-item
        ref={layerRef}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ marginLeft: `${level * 10}px` }} onClick={toggleOpen}>
            <PolarisIcon source={open ? ChevronUpMinor : ChevronDownMinor} />
          </div>
          <div style={{ flex: '1 1 auto' }}>{name}</div>
          <div style={{ cursor: 'pointer' }} onClick={toggleVisibility}>
            <PolarisIcon source={visible ? ViewMinor : HideMinor} />
          </div>
        </div>
      </div>
      {!!(open && components.length) && (
        <div className={cx('max-w-full', !open && 'hidden')}>{cmpToRender}</div>
      )}
    </div>
  );
}
