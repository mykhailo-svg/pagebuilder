import db from '../db.server';
const templates = {
  page: (pageName: string) => {
    return `{
      "sections": {
        "${pageName}": {
          "type": "${pageName}",
          "settings": {
          }
        }
      },
      "order": [
        "${pageName}"
      ]
    }`;
  },
  product: (pageName: string) => {
    return `{
      "sections": {
        "${pageName}": {
          "type": "${pageName}",
          "settings": {
          }
        }
      },
      "order": [
        "${pageName}"
      ]
    }`;
  },
  collection: (pageName: string) => {
    return `{
      "sections": {
        "${pageName}": {
          "type": "${pageName}",
          "settings": {
            "show_collection_description": true,
            "show_collection_image": false,
            "color_scheme": "background-1"
          }
        },
        "banner": {
          "type": "main-collection-banner",
          "settings": {
            "show_collection_description": true,
            "show_collection_image": false,
            "color_scheme": "background-1"
          }
        },
        "product-grid": {
          "type": "main-collection-product-grid",
          "settings": {
            "products_per_page": 16,
            "columns_desktop": 4,
            "color_scheme": "background-1",
            "image_ratio": "adapt",
            "image_shape": "default",
            "show_secondary_image": false,
            "show_vendor": false,
            "show_rating": false,
            "enable_quick_add": false,
            "enable_filtering": true,
            "filter_type": "horizontal",
            "enable_sorting": true,
            "columns_mobile": "2",
            "padding_top": 36,
            "padding_bottom": 36
          }
        }
      },
      "order": [
        "banner",
        "product-grid","${pageName}"
      ]
    }`;
  },
};

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
  templateType: string;
};

export async function createNewPage({
  themeId,
  shop,
  name,
  templateType,
}: CreatePageArgs) {
  const id = generateUniqueID();
  try {
    const page = await db.page.create({
      data: {
        themeId,
        id,
        shop,
        name,
        templateType,
        template: templates[templateType as 'page'](`${name}-${id}`),
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

type DeletePagesArgs = {
  ids: string[];
};

export async function deletePages({ ids }: DeletePagesArgs) {
  const page = await db.page.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return page;
}
