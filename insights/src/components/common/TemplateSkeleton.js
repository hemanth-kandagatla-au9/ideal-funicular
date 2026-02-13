import React from "react";
import { Card, CardContent, Skeleton } from "@mui/material";

const TemplateCardSkeleton = () => (
  <Card
    style={{
      width: "100%",
      minHeight: "150px",
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      boxShadow: "none",
    }}
  >
    <CardContent
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
        <Skeleton animation="wave" variant="text" width={150} height={24} />
      </div>

      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={10} width="80%" />

      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <Skeleton animation="wave" variant="rounded" width={60} height={20} />
          <Skeleton animation="wave" variant="rounded" width={70} height={20} />
          <Skeleton animation="wave" variant="rounded" width={50} height={20} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TemplateCardSkeleton;
