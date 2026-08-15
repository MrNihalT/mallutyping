"use client";

import { motion } from "framer-motion";

export default function FloatingClouds() {
    return (
        <>
            <motion.div
                animate={{ x: [0, 80, 0] }}
                transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-10 left-10"
            >
                <div className="h-24 w-44 rounded-full bg-white/60 blur-sm" />
            </motion.div>

            <motion.div
                animate={{ x: [0, -120, 0] }}
                transition={{
                    duration: 80,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-40 right-10"
            >
                <div className="h-32 w-56 rounded-full bg-white/60 blur-sm" />
            </motion.div>

            <motion.div
                animate={{ x: [0, 100, 0] }}
                transition={{
                    duration: 95,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-24 left-1/3"
            >
                <div className="h-20 w-36 rounded-full bg-white/40 blur-sm" />
            </motion.div>
        </>
    );
}
