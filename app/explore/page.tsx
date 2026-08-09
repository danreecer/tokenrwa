import type { Metadata } from "next";
import ExploreClient from "./grid";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse curated tokenized real-world assets by category and run AI research on any of them.",
};

export default function ExplorePage() {
  return <ExploreClient />;
}
