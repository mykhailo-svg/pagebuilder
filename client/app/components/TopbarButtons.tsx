import * as React from 'react';
import { useEditor } from '@grapesjs/react';
import {
  mdiArrowULeftTop,
  mdiArrowURightTop,
  mdiBorderRadius,
  mdiFullscreen,
  mdiXml,
} from '@mdi/js';
import {
  MaximizeMajor,
  LogoBlockMajor,
  CodeMajor,
  RedoMajor,
  UndoMajor,
} from '@shopify/polaris-icons';
import Icon from '@mdi/react';
import type { FunctionComponent, SVGProps} from 'react';
import { useEffect, useState } from 'react';
import { BTN_CLS, MAIN_BORDER_COLOR, cx } from './common';
import { Button } from '@shopify/polaris';

interface CommandButton {
  id: string;
  iconPath: FunctionComponent<SVGProps<SVGSVGElement>>;
  options?: Record<string, any>;
  disabled?: () => boolean;
}

export default function TopbarButtons({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const { UndoManager, Commands } = editor;
  const cmdButtons: CommandButton[] = [
    {
      id: 'core:component-outline',
      iconPath: LogoBlockMajor,
    },
    {
      id: 'core:open-code',
      iconPath: CodeMajor,
    },
    {
      id: 'core:undo',
      iconPath: UndoMajor,
      disabled: () => !UndoManager.hasUndo(),
    },
    {
      id: 'core:redo',
      iconPath: RedoMajor,
      disabled: () => !UndoManager.hasRedo(),
    },
  ];

  useEffect(() => {
    const cmdEvent = 'run stop';
    const updateEvent = 'update';
    const updateCounter = () => setUpdateCounter((value) => value + 1);
    const onCommand = (id: string) => {
      cmdButtons.find((btn) => btn.id === id) && updateCounter();
    };
    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, []);

  return (
    <div className={cx('flex gap-3', className)}>
      {cmdButtons.map(({ id, iconPath, disabled, options = {} }) => (
        <Button
          key={id}
          icon={iconPath}
          size="large"
          onClick={() =>
            Commands.isActive(id)
              ? Commands.stop(id)
              : Commands.run(id, options)
          }
          disabled={disabled?.()}
        ></Button>
      ))}
    </div>
  );
}
