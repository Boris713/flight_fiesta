import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

function HalfPageLayout({ leftChild, rightChild }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">{leftChild}</div>
        <div className="col-md-6">{rightChild}</div>
      </div>
    </div>
  );
}
export default HalfPageLayout;
