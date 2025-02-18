import React from "react";
import { useLocation } from "react-router-dom";

function ManageServices() {
  const location = useLocation();
  const { client } = location.state || {};
  console.log(client);
  return <div>ManageServices</div>;
}

export default ManageServices;
