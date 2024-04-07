import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormTextfield = ({
  fullWidth = true,
  size = "small",
  label,
  className,
  type = "text",
  id,
  autoComplete,
  value,
  onChange,
  error,
  helperText,
  showPassword = false,
  handleTogglePasswordVisibility,
  ...rest
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      size={size}
      label={label}
      className={className}
      type={type === 'password' && showPassword ? 'text' : type}
      id={id}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      InputProps={
        id === 'password'
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    size="small"
                    style={{ color: "#FF6F1A" }}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : null
      }
      {...rest}
    />
  );
};

export default FormTextfield;
