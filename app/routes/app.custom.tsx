//@ts-nocheck
import { useState, useEffect } from 'react';
import { Page } from '@shopify/polaris';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPluginBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginCkEditor from 'grapesjs-plugin-ckeditor';
import grapesStyles from '../main.css';
export const links = () => [{ rel: 'stylesheet', href: grapesStyles }];

export default function AdditionalPage() {
  const [editor, setEditor] = useState<any>(null);
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#editor',
      plugins: [gjsPresetWebpage, gjsPluginCkEditor, gjsPluginBlocksBasic],
      pluginsOpts: {
        gjsPresetWebpage: {},
        gjsPluginCkEditor: {},
        gjsPluginBlocksBasic: {},
      },
    });
    setEditor(editor);
  }, []);

  return (
    <>
      {' '}
      <div id="navbar" className="sidenav d-flex flex-column overflow-scroll">
        <nav className="navbar navbar-light">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h3 logo">Code Dexterous</span>
          </div>
        </nav>
        <div className="my-2 d-flex flex-column">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm mb-2 mx-2"
            data-bs-toggle="modal"
            data-bs-target="#addPageModal"
          >
            <i className="fa fa-plus"></i>
            Add Page
          </button>
          <ul className="list-group pages">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Home
              <div className="m-2">
                <button className="btn btn-sm btn-outline-primary">
                  <i className="fa fa-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              About
              <div className="m-2">
                <button className="btn btn-sm btn-outline-primary">
                  <i className="fa fa-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Contact Us
              <div className="m-2">
                <button className="btn btn-sm btn-outline-primary">
                  <i className="fa fa-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div className="">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="block-tab"
                data-bs-toggle="tab"
                data-bs-target="#block"
                type="button"
                role="tab"
                aria-controls="block"
                aria-selected="true"
              >
                <i className="fa fa-cubes"></i>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="layer-tab"
                data-bs-toggle="tab"
                data-bs-target="#layer"
                type="button"
                role="tab"
                aria-controls="layer"
                aria-selected="false"
              >
                <i className="fa fa-tasks"></i>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="style-tab"
                data-bs-toggle="tab"
                data-bs-target="#style"
                type="button"
                role="tab"
                aria-controls="style"
                aria-selected="false"
              >
                <i className="fa fa-paint-brush"></i>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="trait-tab"
                data-bs-toggle="tab"
                data-bs-target="#trait"
                type="button"
                role="tab"
                aria-controls="trait"
                aria-selected="false"
              >
                <i className="fa fa-cog"></i>
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="block"
              role="tabpanel"
              aria-labelledby="block-tab"
            >
              <div id="blocks"></div>
            </div>
            <div
              className="tab-pane fade"
              id="layer"
              role="tabpanel"
              aria-labelledby="layer-tab"
            >
              <div id="layers-container"></div>
            </div>
            <div
              className="tab-pane fade"
              id="style"
              role="tabpanel"
              aria-labelledby="style-tab"
            >
              <div id="styles-container"></div>
            </div>
            <div
              className="tab-pane fade"
              id="trait"
              role="tabpanel"
              aria-labelledby="trait-tab"
            >
              <div id="trait-container"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-content">
        <nav className="navbar navbar-light">
          <div className="container-fluid">
            <div className="panel__devices"></div>
            <div className="panel__basic-actions"></div>
          </div>
        </nav>
        <div id="editor"></div>
        <div
          className="modal fade"
          id="addPageModal"
          tabindex="-1"
          aria-labelledby="addPageModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form
                id="create-page"
                onsubmit="return validatForm(event)"
                novalidate
              >
                <div className="modal-header">
                  <h5 className="modal-title" id="addPageModalLabel">
                    Create Page
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="col-auto">
                    <label for="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="name"
                      name="name"
                      placeholder="Name of Page"
                      required
                    />
                    <div className="invalid-feedback">
                      Please provide a valid name.
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    data-bs-dismiss="modal"
                    onClick="clearForm()"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
