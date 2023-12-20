/* eslint-disable no-undef */
/* eslint-disable import/no-anonymous-default-export */
//@ts-nocheck
import { Editor } from "grapesjs";


export default function (editor: Editor, opts = {}) {
    const dc = editor.DomComponents;
    const defaultType = dc.getType("default");
    const defaultView = defaultType.view;

    dc.addType(opts.name, {
        model: {
            defaults: {
                traits: [
                    {
                        type: "checkbox",
                        name: "dynamicProgress",
                        label: "Dynamic Progress",
                        changeProp: 1,
                    },
                    {
                        type: "select",
                        name: "progressType",
                        label: "Progress Type",
                        changeProp: 1,
                        options: [
                            { value: "bullets", name: "Bullets" },
                            { value: "fraction", name: "Fraction" },
                            { value: "progressbar", name: "Progressbar" },
                        ],
                    },
                ],
                script: function () {
                    const dynamicProgress = "{[ dynamicProgress ]}";
                    const progressType = "{[ progressType ]}";

                    alert(progressType)

                    const elem = document.querySelector(".gjs-selected");

                    elem?.classList.add("sdsdsdsdaafd")






                },
            },
        },

        isComponent: (el) => {
            if (el.className && el.className.includes("swiper-container")) {
                return {
                    type: opts.name,
                };
            }
        },

        view: defaultView.extend({
            init({ model }) {
                this.listenTo(model, "change:dynamicProgress", this.updateScript);
                this.listenTo(model, "change:progressType", this.updateScript);
            },
        }),
    });
};