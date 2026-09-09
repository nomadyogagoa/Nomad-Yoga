"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { schedule, weekDays } from "@/data/schedule";

type DayFilter = "All" | (typeof weekDays)[number];
type LevelFilter = "All" | "All Levels" | "Intermediate" | "Experienced";
type TimeFilter = "All" | "Morning" | "Evening";

export function InteractiveSchedule() {
  const [selectedDay, setSelectedDay] = useState<DayFilter>("All");
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("All");
  const [selectedTime, setSelectedTime] = useState<TimeFilter>("All");

  const todayIndex = new Date().getDay();
  // In JS: 0 is Sunday, 1 is Monday...
  const todayName = todayIndex === 0 ? "Sunday" : weekDays[todayIndex - 1];

  const filteredDays = useMemo(() => {
    return selectedDay === "All" ? weekDays : [selectedDay];
  }, [selectedDay]);

  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      // Day filter
      if (selectedDay !== "All" && item.day !== selectedDay) {
        return false;
      }
      // Level filter
      if (selectedLevel !== "All" && item.level !== selectedLevel) {
        return false;
      }
      // Time filter
      if (selectedTime === "Morning") {
        if (!item.time.includes("AM")) return false;
      } else if (selectedTime === "Evening") {
        if (!item.time.includes("PM")) return false;
      }
      return true;
    });
  }, [selectedDay, selectedLevel, selectedTime]);

  const totalCount = filteredSchedule.length;
  const isFiltered = selectedDay !== "All" || selectedLevel !== "All" || selectedTime !== "All";

  const resetFilters = () => {
    setSelectedDay("All");
    setSelectedLevel("All");
    setSelectedTime("All");
  };

  return (
    <div className="interactive-schedule">
      {/* Day Selector Tabs */}
      <div className="schedule-filter-bar">
        <div className="schedule-day-tabs" role="tablist" aria-label="Filter schedule by day">
          <button
            type="button"
            role="tab"
            aria-selected={selectedDay === "All"}
            className={`schedule-tab-btn ${selectedDay === "All" ? "is-active" : ""}`}
            onClick={() => setSelectedDay("All")}
          >
            All Days
          </button>
          {weekDays.map((day) => {
            const isToday = day === todayName;
            return (
              <button
                key={day}
                type="button"
                role="tab"
                aria-selected={selectedDay === day}
                className={`schedule-tab-btn ${selectedDay === day ? "is-active" : ""}`}
                onClick={() => setSelectedDay(day)}
              >
                <span>{day.slice(0, 3)}</span>
                {isToday && <em className="today-badge">Today</em>}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Chips: Level & Time of Day */}
        <div className="schedule-chip-row">
          <div className="schedule-chip-group">
            <span className="filter-label">Level:</span>
            {(["All", "All Levels", "Intermediate", "Experienced"] as const).map((level) => (
              <button
                key={level}
                type="button"
                className={`schedule-chip ${selectedLevel === level ? "is-active" : ""}`}
                onClick={() => setSelectedLevel(level)}
              >
                {level === "All" ? "Any Level" : level}
              </button>
            ))}
          </div>

          <div className="schedule-chip-group">
            <span className="filter-label">Time:</span>
            {(["All", "Morning", "Evening"] as const).map((time) => (
              <button
                key={time}
                type="button"
                className={`schedule-chip ${selectedTime === time ? "is-active" : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time === "All" ? "Any Time" : `${time} Flow`}
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="schedule-status-row">
          <span className="schedule-count">
            Showing <strong>{totalCount}</strong> {totalCount === 1 ? "practice" : "practices"}
            {selectedDay !== "All" ? ` for ${selectedDay}` : ""}
            {selectedLevel !== "All" ? ` • ${selectedLevel}` : ""}
            {selectedTime !== "All" ? ` • ${selectedTime}` : ""}
          </span>
          {isFiltered && (
            <button
              type="button"
              className="schedule-reset-btn"
              onClick={resetFilters}
            >
              Reset filters ↺
            </button>
          )}
        </div>
      </div>

      {/* Schedule Content */}
      <div className="schedule-full">
        {filteredDays.map((day) => {
          const dayItems = filteredSchedule.filter((x) => x.day === day);
          if (selectedDay === "All" && dayItems.length === 0 && isFiltered) {
            return null;
          }

          return (
            <section className="day-block" key={day}>
              <Reveal as="div" className="day-heading">
                <span>{day.slice(0, 3)}</span>
                <h2>{day}</h2>
              </Reveal>

              <div>
                {dayItems.map((x, i) => (
                  <Reveal
                    as="article"
                    className="class-row"
                    key={`${day}-${x.time}-${x.title}`}
                    delay={i * 0.04}
                  >
                    <time>{x.time}</time>
                    <div>
                      <h3>{x.title}</h3>
                      <span>{x.instructor}</span>
                    </div>
                    <span className="class-tag">{x.level}</span>
                    <span>{x.duration}</span>
                    <button aria-label={`Book ${x.title}`}>+</button>
                  </Reveal>
                ))}

                {dayItems.length === 0 && (
                  <p className="rest-day">
                    No practices match your selection — a gentle invitation to rest or try another filter.
                  </p>
                )}
              </div>
            </section>
          );
        })}

        {totalCount === 0 && (
          <div className="schedule-empty-state">
            <p className="eyebrow">NO CLASSES FOUND</p>
            <h3>A gentle pause.</h3>
            <p>No practices match your current filter combination.</p>
            <button type="button" className="button button-small" onClick={resetFilters}>
              View all practices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
