import { Editor } from "grapesjs";

export default (editor: Editor, opts = {} as any) => {
    const dc = editor.DomComponents;

    dc.addType(opts.name, {
        model: {
            defaults: {
                traits: [
                    { type: "checkbox", name: "dynamicProgress", label: "Dynamic progress", changeProp: true, }, {
                        type: "select",
                        name: "Progress_type",
                        label: "Progress type",
                        changeProp: true,
                        options: [
                            { value: "bullets", name: "Bullets" },
                            { value: "fraction", name: "fraction" }
                        ]
                    }
                ],
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