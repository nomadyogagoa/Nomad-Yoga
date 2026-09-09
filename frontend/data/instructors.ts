export type Instructor = {
  slug: string;
  name: string;
  role: string;
  experience: string;
  image?: string;
  bio: string;
  specialties: string[];
  quote: string;
};

import { nomadTeam } from "@/data/about";

export const instructors: Instructor[] = nomadTeam;

export function getInstructor(slug: string) {
  return instructors.find((instructor) => instructor.slug === slug);
}
