import React, { useEffect, useState } from "react";
import { Modal, Typography, Fade, Backdrop, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

function SignupConfirmation(props) {
    const { open } = props;
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        let timer;
        if (open) {
          timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
          }, 1000);
        }
        return () => {
          clearInterval(timer);
        };
      }, [open]);
    
      useEffect(() => {
        if (countdown === 0) {
          window.location.reload();
        }
      }, [countdown]);

    return (
        <Modal open={open} disableAutoFocus BackdropComponent={Backdrop}>
          <Fade in={open}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5px',
                textAlign: 'center',
                backdropFilter: 'blur(5px)'
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#e6923a', marginBottom: 2 }} />
              <Typography variant="h6">Your account has been created. Redirecting in {countdown} seconds</Typography>
              <CircularProgress size={24} style={{ marginTop: 10 }} />
            </div>
          </Fade>
        </Modal>
      );
}

export default SignupConfirmation;