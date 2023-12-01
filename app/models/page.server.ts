import db from '../db.server';

export async function getPages() {
  try {
    const pages = await db.page.create({
      data: { themeId: 'sfsf', id: generateUniqueID() },
    });
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

export async function createNewPage() {
  try {
    const pages = await db.page.create({
      data: { themeId: 'sfsf', id: generateUniqueID() },
    });
    return pages;
  } catch (error) {
    return error;
  }
}
