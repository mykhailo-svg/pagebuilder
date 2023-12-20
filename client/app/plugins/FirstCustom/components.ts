import { Editor } from "grapesjs";

export default (editor: Editor, opts = {} as any) => {
    const dc = editor.DomComponents;

    dc.addType(opts.name, {
        model: {
            defaults: {
                script: function () {
                    alert('sdsd')
                }
            }
        },
        isComponent: (el) => {
            if (el.className && el.className.includes("mycustpm-container")) {
                return {
                    type: opts.name
                }
            }
        }
    })

}