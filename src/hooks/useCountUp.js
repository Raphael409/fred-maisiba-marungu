// src/hooks/useCountUp.js
// Animates a number counting up from 0 to `target` once the element
// scrolls into view. Respects prefers-reduced-motion (jumps straight
// to the target instead of animating).

import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, { duration = 1500 } = {}) {
    const [value, setValue] = useState(0)
    const ref = useRef(null)
    const hasRun = useRef(false)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (prefersReducedMotion) {
            setValue(target)
            return
        }

        const node = ref.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasRun.current) {
                    hasRun.current = true
                    const start = performance.now()

                    function tick(now) {
                        const elapsed = now - start
                        const progress = Math.min(elapsed / duration, 1)
                        // Ease-out cubic for a natural deceleration
                        const eased = 1 - Math.pow(1 - progress, 3)
                        setValue(Math.round(eased * target))
                        if (progress < 1) requestAnimationFrame(tick)
                    }
                    requestAnimationFrame(tick)
                }
            },
            { threshold: 0.4 }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [target, duration])

    return [ref, value]
}