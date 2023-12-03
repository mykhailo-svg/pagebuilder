export type PagePublishStatus = 'neverPublished' | 'published' | 'notPublished';
export type PageType = {
  id: string;
  css: string;
  html: string;
  themeId: string;
  shop: string;
  name: string;
  status: PagePublishStatus;
  isPublished: boolean;
  isInShopify: boolean;
};
