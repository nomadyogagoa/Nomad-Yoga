"use client";

import { useState } from "react";
import { weeklyProgress } from "@/data/member";

export function MindfulRhythmCard() {
  const [isBreathing, setIsBreathing] = useState(false);
  const totalHours = (weeklyProgress.minutesPracticed / 60).toFixed(1);

  return (
    <section className="member-list-card mindful-rhythm-card" aria-labelledby="mindful-rhythm-title">
      <div className="member-section-heading">
        <div>
          <p className="member-kicker">Mindful rhythm</p>
          <h2 id="mindful-rhythm-title">Lunar & Breath Cycle</h2>
        </div>
        <span className="mindful-lunar-badge">🌔 Waxing Moon</span>
      </div>

      <div className="mindful-rhythm-body">
        <div className="mindful-rhythm-stat">
          <div className="mindful-circle-wrap">
            <svg className="mindful-circle-svg" viewBox="0 0 36 36">
              <path
                className="mindful-circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="mindful-circle-fill"
                strokeDasharray="80, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="mindful-circle-text">
              <strong>{totalHours}h</strong>
              <small>mindful</small>
            </div>
          </div>
          <div className="mindful-rhythm-narrative">
            <p className="mindful-affirmation">
              &ldquo;You have nurtured <strong>{totalHours} hours</strong> of conscious movement this season.&rdquo;
            </p>
            <span className="mindful-subtext">
              12-day grounding streak · 4 of 5 weekly practices complete
            </span>
          </div>
        </div>

        {/* Breath Intention Interactive Pause */}
        <div className="mindful-breath-box">
          <div className="mindful-breath-head">
            <div>
              <strong>Intention of the Day</strong>
              <p>&ldquo;Inhale space into the mind, exhale tension from the body.&rdquo;</p>
            </div>
            <button
              type="button"
              className={`mindful-breath-btn ${isBreathing ? "is-breathing" : ""}`}
              onClick={() => setIsBreathing(!isBreathing)}
              aria-label={isBreathing ? "Pause breath guide" : "Start 3 conscious breaths"}
            >
              {isBreathing ? "Pause ⏸" : "Breathe ✦"}
            </button>
          </div>

          {isBreathing && (
            <div className="mindful-breath-pacer" aria-live="polite">
              <div className="mindful-breath-orb" />
              <span>Inhale deeply... Hold... Exhale slowly...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
