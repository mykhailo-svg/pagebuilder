import type { PagePublishStatus } from '~/global_types';
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

export async function getPages({ page }: { page: number }) {
  try {
    const itemsPerPage = 2;
    const pages = await db.page.findMany({
      skip: page * itemsPerPage,
      take: itemsPerPage,
    });
    const nextStepPages = await db.page.findMany({
      skip: (page + 1) * itemsPerPage,
      take: itemsPerPage,
    });
    let hasPrevious = false;
    if (page - 1 > -1) {
      const previousStepPages = await db.page.findMany({
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
      });
      if (previousStepPages.length > 0) {
        hasPrevious = true;
      }
    }

    return {
      pages,
      hasNext: nextStepPages.length > 0,
      hasPrevious,
      nextStepPages,
    };
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
  const existingPage = await db.page.findUnique({
    where: { id },
  });

  if (!existingPage) {
    throw new Error(`Page with ID ${id} not found`);
  }
  const currentStatus = existingPage.status as PagePublishStatus;
  let nextStatus: PagePublishStatus = currentStatus;
  if (currentStatus !== 'notPublished') {
    nextStatus = 'notPublished';
  } else {
    nextStatus = 'published';
  }

  const page = await db.page.update({
    where: { id },
    data: {
      status: nextStatus,
      css,
      shouldPublish: !existingPage.shouldPublish,
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
