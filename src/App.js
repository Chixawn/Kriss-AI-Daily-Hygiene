import React, { useState, useEffect } from "react";

const TEAM_MACRO_GOAL = 36500;
const MILESTONES = [
  { clinics: 500, reward: 500 },
  { clinics: 1000, reward: 1000 },
  { clinics: 5000, reward: 5000 },
  { clinics: 10000, reward: 10000 },
  { clinics: 20000, reward: 20000 },
];

function safeRate(numerator, denominator) {
  const num = parseInt(numerator, 10);
  const den = parseInt(denominator, 10);
  if (isNaN(num) || isNaN(den) || den === 0) return "0%";
  return ((num / den) * 100).toFixed(1) + "%";
}

export default function DailyHygieneTracker() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("krissaiTasks");
    const today = new Date().toDateString();
    const lastCheckedDate = localStorage.getItem("krissaiLastCheckedDate");
    if (savedTasks && lastCheckedDate === today) {
      return JSON.parse(savedTasks);
    }
    return {
      dmRecruits: false,
      dmClients: false,
      linkedinEngage: false,
    };
  });

  const [funnel, setFunnel] = useState(() => {
    const savedFunnel = localStorage.getItem("krissaiFunnel");
    const today = new Date().toDateString();
    const lastCheckedDate = localStorage.getItem("krissaiLastCheckedDate");
    if (savedFunnel && lastCheckedDate === today) {
      return JSON.parse(savedFunnel);
    }
    return {
      icebreakers: "",
      connectAccepts: "",
      chitchats: "",
      demoAccepts: "",
      demoShows: "",
      signUps: "",
    };
  });

  // <--- This line MUST be here! --->
  const [clinics] = useState(1200);

  useEffect(() => {
    localStorage.setItem("krissaiTasks", JSON.stringify(tasks));
    localStorage.setItem("krissaiFunnel", JSON.stringify(funnel));
    localStorage.setItem("krissaiLastCheckedDate", new Date().toDateString());
  }, [tasks, funnel]);

  function toggleTask(taskName) {
    setTasks((prev) => ({ ...prev, [taskName]: !prev[taskName] }));
  }

  function handleFunnelChange(e) {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFunnel((prev) => ({ ...prev, [name]: value }));
    }
  }

  const currentClinicsValue = clinics;
  const nextMilestone =
    MILESTONES.find((m) => currentClinicsValue < m.clinics) ||
    MILESTONES[MILESTONES.length - 1];
  const progressPercent = (currentClinicsValue / nextMilestone.clinics) * 100;
  const clampedProgressPercent = Math.min(progressPercent, 100).toFixed(1);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f4f8",
        borderRadius: 8,
      }}
    >
      <h1 style={{ textAlign: "center", color: "#0d9488" }}>
        KrissAI Daily Hygiene
      </h1>
      <p
        style={{
          fontStyle: "italic",
          textAlign: "center",
          color: "#0d9488",
        }}
      >
        Another day is another step closer to our micro goal!
      </p>

      <div
        style={{
          backgroundColor: "#d1fae5",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#065f46" }}>Today's Essential Hygiene</h2>
        <label>
          <input
            type="checkbox"
            checked={tasks.dmRecruits}
            onChange={() => toggleTask("dmRecruits")}
          />
          <span
            style={{
              marginLeft: 8,
              textDecoration: tasks.dmRecruits ? "line-through" : "none",
            }}
          >
            DM 10 Recruits on TikTok
          </span>
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={tasks.dmClients}
            onChange={() => toggleTask("dmClients")}
          />
          <span
            style={{
              marginLeft: 8,
              textDecoration: tasks.dmClients ? "line-through" : "none",
            }}
          >
            DM 10 Potential Clients
          </span>
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={tasks.linkedinEngage}
            onChange={() => toggleTask("linkedinEngage")}
          />
          <span
            style={{
              marginLeft: 8,
              textDecoration: tasks.linkedinEngage ? "line-through" : "none",
            }}
          >
            Post, Repost, or Comment on LinkedIn
          </span>
        </label>
      </div>

      <div
        style={{
          backgroundColor: "#dbeafe",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#1e40af" }}>Sales Funnel Inputs & Rates</h2>
        {[
          "icebreakers",
          "connectAccepts",
          "chitchats",
          "demoAccepts",
          "demoShows",
          "signUps",
        ].map((name) => (
          <div key={name} style={{ marginBottom: 10 }}>
            <label
              style={{
                textTransform: "capitalize",
                display: "block",
                marginBottom: 4,
              }}
            >
              {name.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="number"
              name={name}
              value={funnel[name]}
              onChange={handleFunnelChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
              min="0"
            />
          </div>
        ))}

        <div
          style={{
            marginTop: 15,
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 4,
          }}
        >
          <p>
            <b>Connect Accept Rate:</b>{" "}
            {safeRate(funnel.connectAccepts, funnel.icebreakers)}
          </p>
          <p>
            <b>Chitchat Rate:</b>{" "}
            {safeRate(funnel.chitchats, funnel.connectAccepts)}
          </p>
          <p>
            <b>Demo Accept Rate:</b>{" "}
            {safeRate(funnel.demoAccepts, funnel.chitchats)}
          </p>
          <p>
            <b>Demo Show Rate:</b>{" "}
            {safeRate(funnel.demoShows, funnel.demoAccepts)}
          </p>
          <p>
            <b>Close Sign-Up Rate:</b>{" "}
            {safeRate(funnel.signUps, funnel.demoShows)}
          </p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#ede9fe",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <h2 style={{ color: "#5b21b6" }}>Team Macro Goal Progress</h2>
        <p>
          Goal: <b>${TEAM_MACRO_GOAL.toLocaleString()}</b>
        </p>
        <p>
          Clinics Reached: <b>{currentClinicsValue.toLocaleString()}</b>
        </p>
        <p>
          Next Milestone: <b>${nextMilestone.reward.toLocaleString()}</b> at{" "}
          <b>{nextMilestone.clinics.toLocaleString()} clinics</b>
        </p>
        <div
          style={{
            backgroundColor: "#c7d2fe",
            borderRadius: 8,
            height: 20,
            overflow: "hidden",
            marginTop: 5,
          }}
        >
          <div
            style={{
              width: `${clampedProgressPercent}%`,
              height: "100%",
              backgroundColor: "#7c3aed",
              transition: "width 0.5s",
            }}
          ></div>
        </div>
        <p style={{ textAlign: "right", fontSize: 12 }}>
          {clampedProgressPercent}% towards next milestone
        </p>
      </div>
    </div>
  );
}
