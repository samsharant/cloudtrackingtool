import React from "react";
import { Box, Modal, IconButton } from "@mui/material";
import CostByAWSAccountChart from "../Graph/CostByAWSAccount";
import ServiceCostChart from "../Graph/ServiceCostChart";
import InventoryTab from "../Tabs/InventoryTab";
import { Close } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ZoomModal({ open, setOpen, data, graphNo }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 0, top: 0 }}
          >
            <Close fontSize="small" />
          </IconButton>
          {graphNo === 2 && <ServiceCostChart data={data} />}
          {graphNo === 1 && <CostByAWSAccountChart data={data} />}
          {graphNo === 3 && <InventoryTab loading={false} error={false} data={data}/>}
        </Box>
      </Modal>
    </div>
  );
}

export default ZoomModal;
