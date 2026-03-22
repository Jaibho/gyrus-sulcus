'use client'

import { useEffect } from 'react'

export default function CopyProtection() {
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const blockCopy = (e: KeyboardEvent) => {
      const isCopy = (e.ctrlKey || e.metaKey) && e.key === 'c'
      const isSelectAll = (e.ctrlKey || e.metaKey) && e.key === 'a'
      const isSave = (e.ctrlKey || e.metaKey) && e.key === 's'
      const isPrint = (e.ctrlKey || e.metaKey) && e.key === 'p'
      // Allow in inputs/textareas
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      if (isCopy || isSelectAll || isSave || isPrint) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', blockContextMenu)
    document.addEventListener('keydown', blockCopy)
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu)
      document.removeEventListener('keydown', blockCopy)
    }
  }, [])

  return null
}
