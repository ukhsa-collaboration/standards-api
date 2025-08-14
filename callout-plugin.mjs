import { visit } from 'unist-util-visit'

const CALLOUT_TYPES = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']
const CALLOUT_RE = new RegExp(
  '^\\[!(' + CALLOUT_TYPES.map(t => escapeRegExp(t)).join('|') + ')\\](?=\\s|$)'
)

// Utility: escape a string for use in a RegExp constructor
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 1. Transform plugin: convert leading [!TYPE] text into a custom node
export function calloutMarkerPlugin() {

  // Register toMarkdown handler at plugin setup time
  const data = this.data()
  const add = (field, value) => {
    const list = data[field] || (data[field] = [])
    list.push(value)
  }

  add('toMarkdownExtensions', {
    handlers: {
      calloutMarker(node) {
        return node.value // emit raw "[!NOTE]" etc., no escaping
      }
    }
  })

  return (tree) => {
    visit(tree, 'blockquote', (bq) => {
      const firstChild = bq.children?.[0]
      if (!firstChild || firstChild.type !== 'paragraph') return
      const firstText = firstChild.children?.[0]
      if (!firstText || firstText.type !== 'text') return
      const match = firstText.value.match(CALLOUT_RE)
      if (!match) return

      const full = match[0]              // e.g. [!NOTE]
      const rest = firstText.value.slice(full.length)

      // Replace the text node with a custom node
      firstChild.children.splice(0, 1, {
        type: 'calloutMarker',
        kind: match[1],
        value: full
      })

      if (rest.length) {
        firstChild.children.splice(1, 0, { type: 'text', value: rest })
      }
    })
  }
}
