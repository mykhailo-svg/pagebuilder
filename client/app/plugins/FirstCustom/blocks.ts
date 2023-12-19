import { Editor } from "grapesjs";

export default (editor: Editor, opts = {} as any) => {
    const blockManager = editor.BlockManager;

    blockManager.add(opts.name, {
        label: `<div>${opts.label}</div>`,
        category: opts.category,
        content:"<div>Custom plugin</div>"
    })
}