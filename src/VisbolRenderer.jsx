import React from "react";
import "./VisbolRenderer.css";

export const VisbolRenderer = ({ display, visbolSequence }) => {
  return (
    <div style={{ display: "flex" }}>
      {visbolSequence.map((vs, i) => {
        return <VisbolCard key={i} info={vs} />;
      })}
    </div>
  );
};

const VisbolCard = ({ info }) => {
  const { name, identifier, orientation, role } = info;

  const infoWithLabel = [
    { label: "Name", value: name },
    { label: "feature Identifier", value: identifier },
    { label: "Orientation", value: orientation },
    { label: "Role", value: role },
  ];
  return (
    <div
      style={{
        width: 128,
        height: 300,
        border: "solid yellow 1px",
        margin: "0 2px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "3em",
          backgroundColor: "rgb(255,255,84)",
          width: "100%",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          fontSize: 14,
          padding: 4,
        }}
      >
        {name}
      </div>
      <div
        style={{
          backgroundColor: "rgba(255,255,84, 0.2)",
          height: "100%",
          width: "100%",
        }}
      >
        {infoWithLabel.map(({ label, value }) => (
          <div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#a3a3a3" }}>
              {label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
