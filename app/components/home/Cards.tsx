"use client";

import { useEffect, useState } from "react";
import SkeletonCard from "./SkeletonCard";
import ExperienceCard from "./ExperienceCard";
import { Experience } from "@/app/lib/types";
import { useSearch } from "@/app/lib/SearchContext";
import Logger from "@/app/lib/logger";

const logger = new Logger("CARDS");

const Cards = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${baseUrl}/api/experiences`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch experiences: ${response.statusText}`
          );
        }

        const data = await response.json();
        setExperiences(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load experiences"
        );
        logger.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    const pendingSearch = sessionStorage.getItem("pendingSearch");
    if (pendingSearch) {
      logger.info("Applying pending search:", pendingSearch);
      setSearchQuery(pendingSearch);
      sessionStorage.removeItem("pendingSearch");
    }
  }, [setSearchQuery]);

  const filteredExperiences = experiences.filter((exp) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      exp.name.toLowerCase().includes(query) ||
      exp.location.toLowerCase().includes(query) ||
      exp.description.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold mb-2">
              Error Loading Experiences
            </p>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (filteredExperiences.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              {searchQuery
                ? `No experiences found for "${searchQuery}"`
                : "No experiences available at the moment."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found{" "}
              <span className="font-semibold">
                {filteredExperiences.length}
              </span>{" "}
              result(s) for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;