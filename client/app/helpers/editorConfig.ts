import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginCkEditor from 'grapesjs-plugin-ckeditor';
import { BuyButtonButtonLayoutMajor } from '@shopify/polaris-icons';
export const initEditorConfig = (html: string) => {
  return grapesjs.init({
    container: '#editor',
    projectData: {
      pages: [
        {
          component: html,
        },
      ],
    },
    blockManager: {
      appendTo: '#blocks',
    },

    styleManager: {
      appendTo: '#styles-container',
      sectors: [
        {
          name: 'Dimension',
          open: false,
          buildProps: ['width', 'min-height', 'padding'],
          properties: [
            {
              type: 'integer',
              name: 'The width',
              property: 'width',
              // units: ['px', '%'],
              defaults: 'auto',
              // min: 0,
            },
          ],
        },
        {
          name: 'Typography',
          properties: [
            {
              type: 'number',
              label: 'Font size',
              property: 'font-size',
              units: ['px', '%', 'em', 'rem', 'vh', 'vw'],
              min: 0,
            },
          ],
        },
      ],
    },
    layerManager: {
      appendTo: '#layers-container',
    },
    traitManager: {
      appendTo: '#trait-container',
    },
    selectorManager: {
      appendTo: '#styles-container',
    },

    panels: {
      defaults: [
        {
          id: 'basic-actions',
          el: '.panel__basic-actions',
          buttons: [
            {
              id: 'visibility',
              active: true, // active by default
              className: 'btn-toggle-borders',
              label: '<i class="fa fa-clone"></i>',
              command: 'sw-visibility', // Built-in command
            },
          ],
        },
        {
          id: 'panel-devices',
          el: '.panel__devices',
          buttons: [
            {
              id: 'device-desktop',
              label: '<i class="fa fa-television"></i>',
              command: 'set-device-desktop',
              active: true,
              togglable: false,
            },
            {
              id: 'device-mobile',

              label: '<i class="fa fa-mobile"></i>',
              command: 'set-device-mobile',
              togglable: false,
            },
          ],
        },
      ],
    },
    deviceManager: {
      devices: [
        {
          name: 'Desktop',
          width: '',
        },
        {
          name: 'Mobile',
          width: '320px',
          widthMedia: '480px',
        },
      ],
    },
    plugins: [gjsPluginCkEditor, gjsPluginBlocksBasic],
    pluginsOpts: {
      gjsPluginCkEditor: {},
      gjsPluginBlocksBasic: {},
    },
  });
};
