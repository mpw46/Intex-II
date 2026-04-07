import { useState, useEffect } from "react";
import type { HomeVisitation } from "../../types/homeVisitation";
import { getVisitations } from "../../api/homeVisitationApi";

function HomeVisitationPage() {
  const [visitations, setVisitations] = useState<HomeVisitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVisitations()
      .then((data) => setVisitations(data))
      .catch(() => setError("Failed to load data. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Home Visitation &amp; Case Conferences</h1>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Log home and field visits, track case conferences, and monitor follow-up
        actions for each resident.
      </p>

      <h2>Planned Features</h2>
      <ul>
        <li>
          Log home/field visits by type: initial assessment, routine follow-up,
          reintegration assessment, post-placement monitoring, emergency
        </li>
        <li>Observations about home environment</li>
        <li>Family cooperation level tracking</li>
        <li>Safety concerns documentation</li>
        <li>Follow-up actions planning</li>
        <li>Case conference history per resident</li>
        <li>Upcoming case conferences view</li>
      </ul>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f0f4f8",
          borderRadius: "8px",
        }}
      >
        <strong>Status:</strong> Placeholder — ready for development
      </div>
    </div>
  );
}
