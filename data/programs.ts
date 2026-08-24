export type Program = {
  slug: string;
  title: string;
  level: string;
  duration: string;
  price: string;
  image: string;
  summary: string;
  description: string;
  benefits: string[];
  focus: string[];
  instructor: string;
};

export const programs: Program[] = [
  {
    slug: 'hatha-yoga',
    title: 'Hatha Yoga',
    level: 'All Levels',
    duration: '60 min',
    price: '₹1,500 / month',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=88',
    summary: 'A grounding practice that balances breath, alignment and mindful movement.',
    description: 'Build a calm, steady foundation through classical postures, deliberate breathing and spacious transitions. Hatha is ideal for beginners and experienced practitioners who want to return to strong fundamentals.',
    benefits: ['Improves mobility and posture', 'Builds body awareness', 'Supports stress reduction', 'Strengthens foundational alignment'],
    focus: ['Breathwork', 'Alignment', 'Mobility', 'Mindfulness'],
    instructor: 'Anjali Sharma',
  },
  {
    slug: 'vinyasa-flow',
    title: 'Vinyasa Flow',
    level: 'Intermediate',
    duration: '60 min',
    price: '₹2,000 / month',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1400&q=88',
    summary: 'Fluid, breath-led sequences designed to create energy, strength and focus.',
    description: 'Move through creative sequences that connect breath with motion. This dynamic class builds resilience, balance and cardiovascular energy while preserving mindful technique.',
    benefits: ['Builds strength and stamina', 'Improves coordination', 'Develops balance', 'Creates a meditative flow state'],
    focus: ['Flow', 'Strength', 'Balance', 'Breath rhythm'],
    instructor: 'Neha Kapoor',
  },
  {
    slug: 'ashtanga-foundations',
    title: 'Ashtanga Foundations',
    level: 'Experienced',
    duration: '75 min',
    price: '₹2,500 / month',
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=1400&q=88',
    summary: 'A disciplined sequence for practitioners who enjoy structure, strength and progression.',
    description: 'Explore the traditional logic of Ashtanga through a guided foundational series. Learn sequence memory, breath, gaze and progressive strength in a supportive environment.',
    benefits: ['Develops disciplined practice', 'Builds full-body strength', 'Improves flexibility', 'Encourages mental focus'],
    focus: ['Primary series', 'Bandhas', 'Drishti', 'Breath control'],
    instructor: 'Rahul Verma',
  },
  {
    slug: 'meditation-breathwork',
    title: 'Meditation & Breathwork',
    level: 'All Levels',
    duration: '45 min',
    price: '₹1,000 / month',
    image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1400&q=88',
    summary: 'Quiet practices for clarity, nervous-system balance and deeper self-awareness.',
    description: 'Learn practical meditation and pranayama techniques in a calm, guided setting. Sessions are designed to be accessible, restorative and useful beyond the studio.',
    benefits: ['Supports calm and focus', 'Encourages better sleep', 'Improves breath awareness', 'Creates sustainable mindfulness habits'],
    focus: ['Pranayama', 'Meditation', 'Relaxation', 'Self-awareness'],
    instructor: 'Meera Joshi',
  },
];

export function getProgram(slug: string) {
  return programs.find((program) => program.slug === slug);
}
