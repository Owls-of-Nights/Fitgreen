"use client"

import { useEffect, useRef } from "react"

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Placeholder for future content
    mountRef.current.innerHTML = "<div style='width: 100%; height: 100%; background: green; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;'>Globe Placeholder</div>"

    // Cleanup on unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = ""
      }
    }
  }, [])

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
}

