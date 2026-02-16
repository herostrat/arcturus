import React, { useEffect, useState } from "react";

import { getHealth } from "./api/client.js";

const EMPTY_STATUS = {
  status: "unknown",
  tileserver: { running: false, pid: null }
};

export default function App() {
  const [health, setHealth] = useState(EMPTY_STATUS);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHealth() {
      try {
        const payload = await getHealth();
        if (!cancelled) {
          setHealth(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    loadHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <h1>Arcturus Admin</h1>
      {error ? (
        <p>Health error: {error}</p>
      ) : (
        <section>
          <h2>Health</h2>
          <p>Status: {health.status}</p>
          <p>Tileserver running: {health.tileserver?.running ? "yes" : "no"}</p>
          <p>Tileserver PID: {health.tileserver?.pid ?? "-"}</p>
        </section>
      )}
    </main>
  );
}
