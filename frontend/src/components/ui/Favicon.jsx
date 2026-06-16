import { useState } from "react";
import { Globe } from "lucide-react";

export default function Favicon({ site }) {
  const domain = site.replace(/https?:\/\//i, "").split("/")[0];
  const [err, setErr] = useState(false);
  if (err) return (
    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#2a211a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Globe size={14} color="#7a6050" />
    </div>
  );
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      onError={() => setErr(true)}
      style={{ width: 28, height: 28, borderRadius: 6, objectFit: "contain", background: "#2a211a", flexShrink: 0 }}
      alt=""
    />
  );
}
