"use client";

import { motion } from "framer-motion";
import { IconLeaf } from "@tabler/icons-react";

const leaves = [
    {
        top: "10%",
        left: "8%",
        size: 30,
        delay: 0,
    },
    {
        top: "30%",
        right: "10%",
        size: 24,
        delay: 2,
    },
    {
        top: "70%",
        left: "20%",
        size: 40,
        delay: 1,
    },
    {
        bottom: "12%",
        right: "15%",
        size: 28,
        delay: 3,
    },
];

export default function FloatingLeaves() {
    return (
        <>
            {leaves.map((leaf, i) => (
                <motion.div
                    key={i}
                    className="absolute text-lime-500/10"
                    style={leaf}
                    animate={{
                        y: [-10, 10, -10],
                        rotate: [-8, 8, -8],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 8,
                        delay: leaf.delay,
                    }}
                >
                    <IconLeaf size={leaf.size} />
                </motion.div>
            ))}
        </>
    );
}
