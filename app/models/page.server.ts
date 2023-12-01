import db from '../db.server';

export async function getPages() {
  const pages = await db.page.findMany();
  return pages;
}
