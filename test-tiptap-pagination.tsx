import { generateJSON } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { PaginationPlus } from 'tiptap-pagination-plus'

const html = '<p>Hello world!</p>'
const json = generateJSON(html, [StarterKit, PaginationPlus.configure({ enabled: true })])
console.log(JSON.stringify(json, null, 2))
