import React, { useEffect, useState } from "react";
import "./InventoryCard.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Error from "@mui/icons-material/Error";
import RotateRight from "@mui/icons-material/RotateRight";
import { Typography } from "@mui/material";

function InventoryCards(props) {
  const { cards, loading, error } = props;
  const [state, setState] = useState(false);
  const sliderSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
  };

  return (
    <Slider
      className="slider-cards-container"
      // infinite={true} // Loop through the cards infinitely
      slidesToShow={1} // Display one card at a time
      slidesToScroll={1} // Scroll one card at a time
      variableWidth={false} // Set to false to display one card at a time
      swipeToSlide={true} // Enable swipe navigation
      arrows={true} // Show navigation arrows (optional)
      dots={true}
      autoplay={true}
      autoplaySpeed={loading ? 10000000 : 3000}
    >
      {cards?.map((card) => (
        <div key={card.title} className="slider-card">
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
    </Slider>
  );
}

export default InventoryCards;

