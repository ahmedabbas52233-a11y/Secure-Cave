import { useState } from "react";
import { Plus, Search, Users, Briefcase, TrendingUp, Globe } from "lucide-react";
import PasswordCard from "./PasswordCard";
import SkeletonCard from "./ui/SkeletonCard";
import EmptyState   from "./ui/EmptyState";

const CATS = ["All", "Social", "Work", "Finance", "Other"];
const CAT_COLOR = { All: "#f97316", Social: "#818cf8", Work: "#38bdf8", Finance: "#34d399", Other: "#a78bfa" };
const CAT_ICON  = { Social: Users, Work: Briefcase, Finance: TrendingUp, Other: Globe };

export default function VaultView({ vault, decryptedPws, visiblePws, loading, onToggle, onCopy, onEdit, onDelete, onAdd }) {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  const filtered = vault.filter(e => {
    const q = search.toLowerCase();
    return (
      (!q || e.site.toLowerCase().includes(q) || (e.username || "").toLowerCase().includes(q)) &&
      (category === "All" || e.category === category)
    );
  });

  return (
    <div style={{ padding: "0 28px 28px" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={13} color="#7a6050" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sites or usernames…" className="cave-input" style={{ paddingLeft: 34 }} />
        </div>
        <button onClick={onAdd} className="btn-ember"><Plus size={14} /> Add</button>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {CATS.map(cat => {
          const active = category === cat;
          const col = CAT_COLOR[cat];
          const Icon = CAT_ICON[cat];
          const count = cat === "All" ? vault.length : vault.filter(e => e.category === cat).length;
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? col + "55" : "#2a1f17"}`, background: active ? col + "15" : "transparent", color: active ? col : "#7a6050", cursor: "pointer", fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: active ? 600 : 400, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5 }}>
              {Icon && <Icon size={10} />} {cat}
              <span style={{ background: active ? col + "22" : "#1a1208", borderRadius: 8, padding: "0px 5px", fontSize: 10, color: active ? col : "#4a3f35" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 && !search && category === "All" ? (
        <EmptyState onAdd={onAdd} />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <Search size={32} style={{ display: "block", margin: "0 auto 14px", color: "#2a1f17" }} />
          <p style={{ color: "#7a6050", fontFamily: "'Cinzel', serif", fontSize: 13 }}>No secrets match your search</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(entry => (
            <PasswordCard
              key={entry._id || entry.id}
              entry={entry}
              decryptedPw={decryptedPws[entry._id || entry.id]}
              visible={visiblePws[entry._id || entry.id]}
              onToggle={() => onToggle(entry)}
              onCopy={() => onCopy(entry)}
              onEdit={() => onEdit(entry)}
              onDelete={() => onDelete(entry._id || entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
