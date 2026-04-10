"use client";

import { useState, useEffect } from "react";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function MonthCalendar({
  year,
  month,
  selectedDate,
  onDateSelect,
  today,
  maxDate,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  year: number;
  month: number;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  today: Date;
  maxDate: Date;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="calendar">
      <div className="calendar-header">
        {onPrev ? (
          <button className="calendar-nav-btn" onClick={onPrev} disabled={prevDisabled} style={prevDisabled ? { opacity: 0.3, cursor: "default" } : undefined}>◀</button>
        ) : <span className="calendar-nav-btn" style={{ visibility: "hidden" }}>◀</span>}
        <h3>
          {year}년 {month + 1}월
        </h3>
        {onNext ? (
          <button className="calendar-nav-btn" onClick={onNext} disabled={nextDisabled} style={nextDisabled ? { opacity: 0.3, cursor: "default" } : undefined}>▶</button>
        ) : <span className="calendar-nav-btn" style={{ visibility: "hidden" }}>▶</span>}
      </div>
      <div className="calendar-weekdays">
        {WEEKDAYS.map((wd, i) => (
          <div key={i} className="calendar-weekday">
            {wd}
          </div>
        ))}
      </div>
      <div className="calendar-days">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={i} className="calendar-day empty" />;
          }

          const date = new Date(year, month, day);
          const dayOfWeek = date.getDay();
          const isPast = date < todayDate;
          const isBeyondMax = date > maxDate;
          const isDisabled = isPast || isBeyondMax;
          const isToday =
            date.getTime() === todayDate.getTime();
          const isSelected =
            selectedDate &&
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate();

          const classNames = ["calendar-day"];
          if (isDisabled) classNames.push("past");
          if (isToday) classNames.push("today");
          if (isSelected) classNames.push("selected");
          if (dayOfWeek === 0) classNames.push("sunday");
          if (dayOfWeek === 6) classNames.push("saturday");

          return (
            <div
              key={i}
              className={classNames.join(" ")}
              onClick={() => {
                if (!isDisabled) {
                  onDateSelect(date);
                }
              }}
            >
              <span>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [today, setToday] = useState(() => new Date());
  const [baseYear, setBaseYear] = useState(() => new Date().getFullYear());
  const [baseMonth, setBaseMonth] = useState(() => new Date().getMonth());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setBaseYear(now.getFullYear());
    setBaseMonth(now.getMonth());
    setMounted(true);

    const scheduleNextMidnight = () => {
      const current = new Date();
      const midnight = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
      const ms = midnight.getTime() - current.getTime();
      return setTimeout(() => {
        setToday(new Date());
        timerId = scheduleNextMidnight();
      }, ms);
    };

    let timerId = scheduleNextMidnight();
    return () => clearTimeout(timerId);
  }, []);

  const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());

  const nextMonth = baseMonth === 11 ? 0 : baseMonth + 1;
  const nextYear = baseMonth === 11 ? baseYear + 1 : baseYear;

  const goBack = () => {
    const currentMonthDate = new Date(baseYear, baseMonth, 1);
    const todayMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (currentMonthDate > todayMonthDate) {
      if (baseMonth === 0) {
        setBaseYear(baseYear - 1);
        setBaseMonth(11);
      } else {
        setBaseMonth(baseMonth - 1);
      }
    }
  };

  const maxMonthDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const secondDisplayMonth = new Date(nextYear, nextMonth, 1);
  const nextNavDisabled = secondDisplayMonth >= maxMonthDate;

  const goForward = () => {
    if (nextNavDisabled) return;
    if (baseMonth === 11) {
      setBaseYear(baseYear + 1);
      setBaseMonth(0);
    } else {
      setBaseMonth(baseMonth + 1);
    }
  };

  if (!mounted) return null;

  return (
    <div className="calendar-wrapper">
      <MonthCalendar
        year={baseYear}
        month={baseMonth}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        today={today}
        maxDate={maxDate}
        onPrev={goBack}
        prevDisabled={baseYear === today.getFullYear() && baseMonth === today.getMonth()}
        onNext={goForward}
        nextDisabled={nextNavDisabled}
      />
      <MonthCalendar
        year={nextYear}
        month={nextMonth}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        today={today}
        maxDate={maxDate}
      />
    </div>
  );
}
