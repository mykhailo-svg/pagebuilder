import db from '../db.server';

export async function getPages() {
  try {
    const pages = await db.page.findMany();
    return pages;
  } catch (error) {
    return error;
  }
}

export function generateUniqueID() {
  const timestamp = new Date().getTime(); // Get current timestamp
  const random = Math.random().toString(36).substring(2, 8); // Generate a random string

  return `${timestamp}-${random}`;
}

type CreatePageArgs = {
  themeId: string;
  shop: string;
  name: string;
};

export async function createNewPage({ themeId, shop, name }: CreatePageArgs) {
  try {
    const page = await db.page.create({
      data: {
        themeId,
        id: generateUniqueID(),
        shop,
        name,
        template: 'sdsd',
        html: '<body id="i7ys"><div id="i0sg"><p>My first page here!</p></div></body>',
      },
    });
    return page;
  } catch (error) {
    return error;
  }
}

export async function getPageById(id: string) {
  try {
    const page = await db.page.findUnique({
      where: { id },
    });
    return page;
  } catch (error) {
    return error;
  }
}
type UpdatePageArgs = {
  id: string;
  css: string;
  html: string;
};

export async function updatePage({ id, css, html }: UpdatePageArgs) {
  const page = await db.page.update({
    where: { id },
    data: {
      css,
      html: html.replace(/\\/g, ''),
    },
  });
  return page;
}
