"use client";

import "./hero-09.css";
import { WordGlobeHero } from "@/components/originkit/ui/hero-09/word-globe-hero";
import type { StatItem } from "@/components/charts";

export interface Hero09Props {
  stats: StatItem[];
}

const Hero09 = ({ stats }: Hero09Props) => <WordGlobeHero stats={stats} />;

export default Hero09;
