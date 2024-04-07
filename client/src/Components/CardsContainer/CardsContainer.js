import React from "react";
import "./CardsContainer.css";
import Error from "@mui/icons-material/Error";
import RotateRight from "@mui/icons-material/RotateRight";
import { Typography } from "@mui/material";

function CardsContainer(props) {
  const { cards, loading, error } = props;

  return (
    <div className="cards-container">
      {cards?.map((card) => (
        <div key={card.title} className="card">
          <div className="card-title-div">{card.title}</div>
          {loading || error ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {loading && <RotateRight className="loading" />}
              {error && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Error />
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    component="p"
                    variant="caption"
                  >
                    Something went wrong
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <div className="card-data-wrapper">
              <div className="icon-div">{card.icon}</div>
              <div className="card-data-div">{card.dataDivElement}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CardsContainer;

