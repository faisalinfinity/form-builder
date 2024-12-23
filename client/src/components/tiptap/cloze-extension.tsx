import { Mark, markPasteRule, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    clozeGap: {
      setClozeGap: () => ReturnType
      unsetClozeGap: () => ReturnType
      toggleClozeGap: () => ReturnType
    }
  }
}

export const ClozeGap = Mark.create({
  name: 'clozeGap',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-type="cloze-gap"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'cloze-gap' }), 0]
  },

  addCommands() {
    return {
      setClozeGap:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name)
        },
      unsetClozeGap:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      toggleClozeGap:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
    }
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: /(?:==)((?:[^=]+))(?:==)/g,
        type: this.type,
      }),
    ]
  },
})

