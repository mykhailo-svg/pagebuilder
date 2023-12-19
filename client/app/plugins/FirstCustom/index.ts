import grapesjs from "grapesjs";

export default grapesjs.plugins.add("customEditorComponent", ((editor, opts) => {
    let options = {
        label: "Customcc",
        name: "CComponent",
        category: "Custom"
    };

    // Extend opts with default values from options
    for (let name in options) {
        if (!(name in opts)) {
            opts[name] = options[name as "label"];
        }
    }



}))