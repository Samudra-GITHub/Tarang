"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { GenreCollection } from "@/types/music";

export function GenreCard({ genre }: { genre: GenreCollection }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <Link
        href={`/search?genre=${encodeURIComponent(genre.name)}`}
        className="group relative block h-28 w-44 shrink-0 overflow-hidden rounded-xl bg-surface-2 shadow-lg shadow-black/30 transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-ring group-hover:shadow-2xl sm:w-48"
      >
        <Image
          src={genre.coverUrl}
          alt=""
          fill
          sizes="192px"
          className="object-cover opacity-75 transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="absolute bottom-3 left-3.5 font-heading text-base font-bold tracking-tight text-white">
          {genre.name}
        </span>
      </Link>
    </motion.div>
  );
}
