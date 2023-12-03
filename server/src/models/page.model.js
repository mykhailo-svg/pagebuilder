const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const pageSchema = mongoose.Schema(
  {
    themeId: { type: String, required: true },
    html: { type: String, default: 'none' },
    css: { type: String, default: 'none' },
    shop: { type: String, required: true },
    isInShopify: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    name: { type: String, default: 'Untitled page' },
    status: {
      type: String,
      enum: ['neverPublished', 'published', 'notPublished'],
      default: 'neverPublished'
    }
  },
  { timestamps: true }
);

pageSchema.plugin(toJSON);

const Page = mongoose.model('pages', pageSchema);

module.exports = Page;
