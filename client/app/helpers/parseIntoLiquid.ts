export const parseIntoLiquid = ({
  html,
  css,
}: {
  html: string;
  css: string;
}) => {
  const parsedCss = `<style>${css}</style>`;
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const body = dom.querySelector('body');
  const innerHtml = body?.innerHTML;

  const parsedHtml = `<div style="margin: 0;">${innerHtml}</div>`;

  const liquid = parsedCss + '\n\n' + parsedHtml;
  return liquid;
};
