'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AuthBackgroundDecorations() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">

            <motion.div
                className="absolute -bottom-10 left-0 w-125"
                initial={{ opacity: 0, x: -60, y: 30 }}
                animate={{ opacity: 1, x: 0,   y: 0  }}
                transition={{
                    duration: 1,
                    ease:     [0.22, 1, 0.36, 1],
                    delay:    0.3,
                }}
            >
                <Image
                    src="/images/vectors/logo-bg-element3.svg"
                    alt=""
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                    priority
                />
            </motion.div>

            <motion.div
                className="absolute bottom-60 -right-16 w-80 h-150"
                initial={{ opacity: 0, x: 60, y: 30 }}
                animate={{ opacity: 1, x: 0,  y: 0  }}
                transition={{
                    duration: 1,
                    ease:     [0.22, 1, 0.36, 1],
                    delay:    0.4,
                }}
            >
                <Image
                    src="/images/illustrations/auth-illustration-bg.png"
                    alt=""
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    priority
                />
            </motion.div>

        </div>
    )
}