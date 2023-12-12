import { Card, InlineGrid } from '@shopify/polaris';
import { useRef } from 'react';

export const TopNav = () => {
  const deviceButtonsRef = useRef<null | HTMLDivElement>(null);
  const basicButtonsRef = useRef<null | HTMLDivElement>(null);
  if (
    deviceButtonsRef.current &&
    deviceButtonsRef.current.children.length === 2
  ) {
    deviceButtonsRef.current.children[0].outerHTML = '';
  }
  if (
    basicButtonsRef.current &&
    basicButtonsRef.current.children.length === 2
  ) {
    basicButtonsRef.current.children[0].outerHTML = '';
  }
  return (
    <>
      <div style={{ width: '100%' }}>
        <Card>
          <InlineGrid columns={2}>
            <div
              style={{
                background: 'var(--bs-white)',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <div className="panel__devices" ref={deviceButtonsRef}></div>
            </div>
            <div
              ref={basicButtonsRef}
              className="panel__basic-actions"
              style={{
                display: 'flex',
                background: 'var(--bs-white)',
                justifyContent: 'flex-end',
              }}
            ></div>
          </InlineGrid>
        </Card>
      </div>
    </>
  );
};
