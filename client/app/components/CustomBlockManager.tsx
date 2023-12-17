import * as React from 'react';
import { BlocksResultProps } from '@grapesjs/react';
import { MAIN_BORDER_COLOR, cx } from './common';
import { Card } from '@shopify/polaris';

export type CustomBlockManagerProps = Pick<
  BlocksResultProps,
  'mapCategoryBlocks' | 'dragStart' | 'dragStop'
>;

export default function CustomBlockManager({
  mapCategoryBlocks,
  dragStart,
  dragStop,
}: CustomBlockManagerProps) {
  return (
    <div className="gjs-custom-block-manager text-left">
      {Array.from(mapCategoryBlocks).map(([category, blocks]: any) => (
        <div key={category}>
          <div className={cx('py-2 px-4 border-y', MAIN_BORDER_COLOR)}>
            {category}
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            {blocks.map((block: any) => (
              <div
                key={block.getId()}
                draggable
                style={{ width: '100px', height: '100px', overflow: 'hidden' }}
                onDragStart={(ev) => dragStart(block, ev.nativeEvent)}
                onDragEnd={() => dragStop(false)}
              >
                <Card>
                  <div
                    className="h-10 w-10"
                    dangerouslySetInnerHTML={{ __html: block.getMedia()! }}
                  />
                  <div
                    className="text-sm text-center w-full"
                    title={block.getLabel()}
                  >
                    {block.getLabel()}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
