export type Instructor = {
  slug: string;
  name: string;
  role: string;
  experience: string;
  image: string;
  bio: string;
  specialties: string[];
  quote: string;
};

export const instructors: Instructor[] = [
  {
    slug: 'anjali-sharma',
    name: 'Anjali Sharma',
    role: 'Hatha & Alignment Teacher',
    experience: '12+ years',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1200&q=88',
    bio: 'Anjali teaches yoga as an intelligent, compassionate practice. Her classes blend precise alignment with breath awareness so students can build confidence at their own pace.',
    specialties: ['Hatha Yoga', 'Alignment', 'Beginner Foundations', 'Pranayama'],
    quote: 'A sustainable practice should make you feel more at home in your body.',
  },
  {
    slug: 'neha-kapoor',
    name: 'Neha Kapoor',
    role: 'Vinyasa & Mobility Teacher',
    experience: '9+ years',
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=1200&q=88',
    bio: 'Neha is known for creative, fluid sequencing that balances challenge with play. Her approach helps students move with freedom while developing strength and body awareness.',
    specialties: ['Vinyasa', 'Mobility', 'Functional Strength', 'Flow Sequencing'],
    quote: 'Movement becomes meaningful when breath and attention arrive together.',
  },
  {
    slug: 'rahul-verma',
    name: 'Rahul Verma',
    role: 'Ashtanga & Strength Teacher',
    experience: '11+ years',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=88',
    bio: 'Rahul brings clarity and discipline to traditional practice without making it rigid. He focuses on progression, safe technique and the mental steadiness that grows from consistency.',
    specialties: ['Ashtanga', 'Strength', 'Traditional Practice', 'Breath Technique'],
    quote: 'Consistency is quieter than motivation, but it changes everything.',
  },
  {
    slug: 'meera-joshi',
    name: 'Meera Joshi',
    role: 'Meditation & Breathwork Guide',
    experience: '10+ years',
    image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=1200&q=88',
    bio: 'Meera guides meditation and breathwork with a practical, grounded style. Her sessions help students develop calm, attention and techniques they can carry into daily life.',
    specialties: ['Meditation', 'Pranayama', 'Restorative Yoga', 'Stress Management'],
    quote: 'Stillness is not empty; it gives us enough space to hear what matters.',
  },
];

export function getInstructor(slug: string) {
  return instructors.find((instructor) => instructor.slug === slug);
}
