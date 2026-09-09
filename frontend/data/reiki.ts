export type ReikiCourse = { level: string; title: string; price: string; image: string; summary: string; details: string[] };

export const reikiContent = {
  hero: "Reiki is a hands-on healing practice that combines universal life-force energy — Prana, Chi or Qi — with human touch and intention, inviting deep relaxation, peace and comfort.",
  about: [
    "In Reiki, energy is understood to move through the body’s central and subtle energy pathways before being offered through the practitioner’s hands, placed gently on or above the body.",
    "The experience may bring warmth, stillness and a deeply relaxed, meditative state. Reiki is approached with care, presence and loving intention.",
  ],
  courses: [
    { level: "Level 1", title: "Usui Shiki Ryoho · First Degree", price: "€200", image: "/images/reiki/level-one.jpg", summary: "Begin your Reiki journey with theory, attunement and hands-on practice across two small-group days.", details: ["For people interested in energy, vibration, massage, healing arts, yoga, meditation or increasing awareness", "Level 1 certification in Usui Shiki Ryoho", "Maximum 7 students; a 50% deposit reserves a place", "2 days, approximately 4–6 hours each day", "Meditation, Chakras, Ayurveda, Tai Chi / Qi Gong, Reiki history and theory", "Level 1 attunement and practical Reiki / massage work", "Tea, coffee, fruit and snacks included"] },
    { level: "Level 2", title: "Usui Shiki Ryoho · Second Degree", price: "€300", image: "/images/reiki/level-two.jpg", summary: "Deepen an existing Reiki practice through review, Level 2 attunement, symbols and advanced energetic work.", details: ["Level 2 certification in Usui Shiki Ryoho", "Maximum 7 students in a small-group setting", "2 days, approximately 4–6 hours each day", "Level 1 review, meditation and Reiki Level 2 attunement", "Qi Gong / Tai Chi and Level 2 symbols", "Sending energy across space and time for physical, emotional and spiritual concepts", "Guided Spirit Guide meditation"] },
  ] satisfies ReikiCourse[],
};
