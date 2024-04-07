import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import EastIcon from "@mui/icons-material/East";

const NewButton = ({ isLoading, onClick, sx, text }) => {
  return (
    <Button
      type="submit"
      size="small"
      color="primary"
      variant="text"
      sx={{...sx, "&:hover .MuiCircularProgress-svg": {
        color: 'orange', // Change loader color to orange on hover
    }}}
      onClick={onClick}
    >
      {isLoading ? (
        <CircularProgress style={{ color: "white" }} size={22} />
      ) : (
        <>
        {text}
        </>
      )}
    </Button>
  );
};

export default NewButton;