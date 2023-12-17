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
          <div
            style={{
              display: 'flex',
              overflow: 'hidden',
              maxWidth: '400px',
              flexWrap: 'wrap',
            }}
          >
            {blocks.map((block: any) => (
              <div
                key={block.getId()}
                draggable
                style={{ display: 'inline-block', minWidth: '150px' }}
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
