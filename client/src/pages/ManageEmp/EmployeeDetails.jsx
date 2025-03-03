import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
function EmployeeDetails() {
  const location = useLocation();
  const { record } = location.state || {};
  console.log(record);
  return <div>EmployeeDetails</div>;
}

export default EmployeeDetails;
