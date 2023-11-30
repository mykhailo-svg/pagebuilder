export const parseIntoLiquid = ({
  html,
  css,
}: {
  html: string;
  css: string;
}) => {
  const parsedCss = `<style>${css}</style>`;
  const parsedHtml = html;

  const liquid = parsedCss + '\n' + parsedHtml;
  return liquid;
};
