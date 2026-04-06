import { useState } from "react";

const safehouseOptions = ["All Safehouses", "Haven House Manila", "Light of Hope Cebu", "New Dawn Davao", "Safe Harbor Iloilo"];
const timeOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"];

const kpiData = {
  "All Safehouses": { residents: 87, activeCases: 64, reintegrated: 23, donations: 142500, pendingConferences: 12, avgProgress: 72 },
  "Haven House Manila": { residents: 28, activeCases: 21, reintegrated: 7, donations: 52000, pendingConferences: 4, avgProgress: 75 },
  "Light of Hope Cebu": { residents: 24, activeCases: 18, reintegrated: 6, donations: 38500, pendingConferences: 3, avgProgress: 68 },
  "New Dawn Davao": { residents: 20, activeCases: 14, reintegrated: 6, donations: 31000, pendingConferences: 3, avgProgress: 74 },
  "Safe Harbor Iloilo": { residents: 15, activeCases: 11, reintegrated: 4, donations: 21000, pendingConferences: 2, avgProgress: 71 },
};

const recentDonations = [
  { donor: "Maria Santos", amount: 5000, type: "Monetary", date: "Apr 5, 2026", safehouse: "Haven House Manila" },
  { donor: "Global Hope Foundation", amount: 25000, type: "Monetary", date: "Apr 4, 2026", safehouse: "All Safehouses" },
  { donor: "James Cruz", amount: 0, type: "In-Kind (Supplies)", date: "Apr 4, 2026", safehouse: "Light of Hope Cebu" },
  { donor: "Ana Reyes", amount: 2500, type: "Monetary", date: "Apr 3, 2026", safehouse: "New Dawn Davao" },
  { donor: "Tech4Good Corp", amount: 0, type: "Skills (IT Training)", date: "Apr 3, 2026", safehouse: "Safe Harbor Iloilo" },
  { donor: "David Park", amount: 1000, type: "Monetary", date: "Apr 2, 2026", safehouse: "Haven House Manila" },
];

const upcomingConferences = [
  { resident: "R-0042", type: "Reintegration Assessment", date: "Apr 7, 2026", worker: "Elena M.", safehouse: "Haven House Manila", priority: "high" },
  { resident: "R-0078", type: "Initial Case Review", date: "Apr 7, 2026", worker: "Sofia L.", safehouse: "Light of Hope Cebu", priority: "medium" },
  { resident: "R-0091", type: "Quarterly Progress", date: "Apr 8, 2026", worker: "Grace T.", safehouse: "New Dawn Davao", priority: "low" },
  { resident: "R-0015", type: "Post-Placement Follow-up", date: "Apr 8, 2026", worker: "Elena M.", safehouse: "Haven House Manila", priority: "high" },
  { resident: "R-0063", type: "Intervention Planning", date: "Apr 9, 2026", worker: "Rosa P.", safehouse: "Safe Harbor Iloilo", priority: "medium" },
];

const atRiskResidents = [
  { id: "R-0033", concern: "Declining emotional state", sessions: 2, lastVisit: "Mar 28", safehouse: "Haven House Manila" },
  { id: "R-0057", concern: "Missed 3 education sessions", sessions: 0, lastVisit: "Mar 20", safehouse: "Light of Hope Cebu" },
  { id: "R-0081", concern: "Family cooperation low", sessions: 1, lastVisit: "Apr 1", safehouse: "New Dawn Davao" },
];

function KPICard({ label, value, subtitle, color, icon }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 12,
      padding: "20px 24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      borderLeft: `4px solid ${color}`,
      flex: "1 1 160px",
      minWidth: 160,
    }}>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span> {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

function PriorityBadge({ level }) {
  const colors = {
    high: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    medium: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
    low: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  };
  const c = colors[level];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 99,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`, textTransform: "uppercase",
    }}>{level}</span>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div style={{ width: "100%", height: 8, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
  );
}

export default function AdminDashboard() {
  const [safehouse, setSafehouse] = useState("All Safehouses");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [activeTab, setActiveTab] = useState("overview");

  const kpi = kpiData[safehouse];

  const filteredDonations = safehouse === "All Safehouses"
    ? recentDonations
    : recentDonations.filter(d => d.safehouse === safehouse || d.safehouse === "All Safehouses");

  const filteredConferences = safehouse === "All Safehouses"
    ? upcomingConferences
    : upcomingConferences.filter(c => c.safehouse === safehouse);

  const filteredAtRisk = safehouse === "All Safehouses"
    ? atRiskResidents
    : atRiskResidents.filter(r => r.safehouse === safehouse);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Top Nav */}
      <nav style={{
        background: "#0f4c5c", color: "white", padding: "0 32px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e8b931", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            &#x1F3E0;
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Haven of Light</span>
          <span style={{
            fontSize: 11, background: "rgba(255,255,255,0.15)", padding: "2px 10px",
            borderRadius: 99, marginLeft: 8, fontWeight: 500,
          }}>Admin Portal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 14 }}>
          <span style={{ opacity: 0.7, cursor: "pointer" }}>Donors</span>
          <span style={{ opacity: 0.7, cursor: "pointer" }}>Caseload</span>
          <span style={{ opacity: 0.7, cursor: "pointer" }}>Process Recording</span>
          <span style={{ opacity: 0.7, cursor: "pointer" }}>Home Visits</span>
          <span style={{ borderBottom: "2px solid #e8b931", paddingBottom: 2, cursor: "pointer" }}>Dashboard</span>
          <div style={{
            width: 32, height: 32, borderRadius: 99, background: "#e8b931",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 14, color: "#0f4c5c", cursor: "pointer",
          }}>A</div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px" }}>
        {/* Page Header + Filters */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Admin Dashboard</h1>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>
              Overview of operations, donations, and resident progress
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <select
              value={safehouse}
              onChange={e => setSafehouse(e.target.value)}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid #d1d5db",
                fontSize: 14, color: "#374151", background: "white", cursor: "pointer",
                outline: "none",
              }}
            >
              {safehouseOptions.map(s => <option key={s}>{s}</option>)}
            </select>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "1px solid #d1d5db",
                fontSize: 14, color: "#374151", background: "white", cursor: "pointer",
                outline: "none",
              }}
            >
              {timeOptions.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <KPICard icon="&#128101;" label="Active Residents" value={kpi.residents} subtitle="across all programs" color="#0f4c5c" />
          <KPICard icon="&#128203;" label="Open Cases" value={kpi.activeCases} color="#6366f1" />
          <KPICard icon="&#127968;" label="Reintegrated" value={kpi.reintegrated} subtitle="this period" color="#16a34a" />
          <KPICard icon="&#128176;" label="Donations" value={`$${(kpi.donations / 1000).toFixed(1)}k`} subtitle={timeRange.toLowerCase()} color="#e8b931" />
          <KPICard icon="&#128197;" label="Pending Conferences" value={kpi.pendingConferences} color="#dc2626" />
        </div>

        {/* Avg Progress Bar */}
        <div style={{
          background: "white", borderRadius: 12, padding: "16px 24px", marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: 20,
        }}>
          <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Avg. Resident Progress</span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={kpi.avgProgress} color="#0f4c5c" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f4c5c" }}>{kpi.avgProgress}%</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {[
            { key: "overview", label: "Overview" },
            { key: "atrisk", label: "At-Risk Alerts" },
            { key: "donations", label: "Recent Donations" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 20px", borderRadius: "8px 8px 0 0", border: "none",
                fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, cursor: "pointer",
                background: activeTab === tab.key ? "white" : "transparent",
                color: activeTab === tab.key ? "#0f4c5c" : "#6b7280",
                boxShadow: activeTab === tab.key ? "0 -1px 3px rgba(0,0,0,0.06)" : "none",
                borderBottom: activeTab === tab.key ? "2px solid #0f4c5c" : "2px solid transparent",
              }}
            >
              {tab.label}
              {tab.key === "atrisk" && filteredAtRisk.length > 0 && (
                <span style={{
                  marginLeft: 6, fontSize: 11, background: "#fef2f2", color: "#dc2626",
                  padding: "1px 7px", borderRadius: 99, fontWeight: 700,
                }}>{filteredAtRisk.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ background: "white", borderRadius: "0 12px 12px 12px", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          {activeTab === "overview" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
                Upcoming Case Conferences
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Resident</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Type</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Date</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Social Worker</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Safehouse</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConferences.map((c, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px", fontWeight: 600, color: "#0f4c5c" }}>{c.resident}</td>
                      <td style={{ padding: "12px", color: "#374151" }}>{c.type}</td>
                      <td style={{ padding: "12px", color: "#374151" }}>{c.date}</td>
                      <td style={{ padding: "12px", color: "#374151" }}>{c.worker}</td>
                      <td style={{ padding: "12px", color: "#6b7280", fontSize: 13 }}>{c.safehouse}</td>
                      <td style={{ padding: "12px" }}><PriorityBadge level={c.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredConferences.length === 0 && (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>No upcoming conferences for this safehouse.</p>
              )}
            </div>
          )}

          {activeTab === "atrisk" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>
                Residents Needing Attention
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
                Flagged based on declining session outcomes, missed activities, or low family cooperation.
              </p>
              {filteredAtRisk.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>No at-risk alerts for this safehouse.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredAtRisk.map((r, i) => (
                    <div key={i} style={{
                      padding: "16px 20px", borderRadius: 10,
                      border: "1px solid #fecaca", background: "#fffbfb",
                      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "#dc2626", fontSize: 15 }}>{r.id}</div>
                        <div style={{ color: "#374151", fontSize: 14, marginTop: 2 }}>{r.concern}</div>
                        <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>{r.safehouse} &middot; Last visit: {r.lastVisit} &middot; Sessions this month: {r.sessions}</div>
                      </div>
                      <button style={{
                        padding: "8px 18px", borderRadius: 8, border: "none",
                        background: "#0f4c5c", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      }}>View Case</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "donations" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
                Recent Donations & Contributions
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Donor</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Type</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Amount</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Date</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Safehouse</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((d, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px", fontWeight: 500, color: "#111827" }}>{d.donor}</td>
                      <td style={{ padding: "12px", color: "#374151" }}>
                        <span style={{
                          fontSize: 12, padding: "2px 10px", borderRadius: 99,
                          background: d.type === "Monetary" ? "#eff6ff" : "#faf5ff",
                          color: d.type === "Monetary" ? "#2563eb" : "#7c3aed",
                        }}>{d.type}</span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: 600, color: d.amount > 0 ? "#16a34a" : "#9ca3af" }}>
                        {d.amount > 0 ? `$${d.amount.toLocaleString()}` : "—"}
                      </td>
                      <td style={{ padding: "12px", color: "#6b7280" }}>{d.date}</td>
                      <td style={{ padding: "12px", color: "#6b7280", fontSize: 13 }}>{d.safehouse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{ textAlign: "center", padding: "24px 0 12px", fontSize: 12, color: "#9ca3af" }}>
          Haven of Light &middot; Admin Portal &middot; Data shown is anonymized &middot; <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}