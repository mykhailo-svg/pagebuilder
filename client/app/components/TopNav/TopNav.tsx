import { Card, InlineGrid } from '@shopify/polaris';

export const TopNav = () => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <Card>
          <InlineGrid columns={2}>
            <div>
              <div className="panel__devices"></div>
            </div>
            <div
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
