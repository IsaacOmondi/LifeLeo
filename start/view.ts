import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import {icons as materialIcons } from '@iconify-json/ic'

addCollection(materialIcons)

edge.use(edgeIconify)