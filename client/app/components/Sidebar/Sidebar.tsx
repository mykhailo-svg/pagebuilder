import React, { useEffect, useRef } from 'react';

export function Sidebar() {
  useEffect(() => {
    console.log('sd');
  }, []);
  const blocksRef = useRef<null | HTMLDivElement>(null);
  if (blocksRef.current && blocksRef.current.children.length === 2) {
    blocksRef.current.children[0].outerHTML = '';
  }
  return (
    <>
      <div className="tab-content">
        <div id="blocks" ref={blocksRef}></div>
        <p>
          dfdfd
          <div id="layers-container"></div>
        </p>
        {/* <p>
          dfldkfd
          <div id="styles-container"></div>
        </p> */}
        {/* <p>
          dfdf<div id="trait-container"></div>
        </p> */}
      </div>
    </>
  );
}
