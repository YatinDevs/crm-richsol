import React from "react";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

function Dashboard() {
  return (
    <ContentWrapper>
      <div className="h-screen flex flex-col justify-center bg-slate-100 items-center">
        <span className="text-5xl font-bold text-gray-700">RICH SOL</span>
        <span className="text-4xl text-gray-700">Admin Dashboard</span>
      </div>
    </ContentWrapper>
  );
}

export default Dashboard;
