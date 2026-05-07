import React from "react";
import { CheckCircle2, Clock3, LayoutDashboard, ListTodo } from "lucide-react";

function DashboardStats({ dashboard }) {
  return (
    <section className="stats-grid">
      <Stat icon={<LayoutDashboard />} label="Total" value={dashboard?.totalTasks || 0} />
      <Stat icon={<ListTodo />} label="To do" value={dashboard?.todo || 0} />
      <Stat icon={<Clock3 />} label="In progress" value={dashboard?.inProgress || 0} />
      <Stat icon={<CheckCircle2 />} label="Done" value={dashboard?.completed || 0} />
    </section>
  );
}

function Stat({ icon, label, value }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{React.cloneElement(icon, { size: 20 })}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default DashboardStats;
