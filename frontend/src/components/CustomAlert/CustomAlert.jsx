import { Alert } from "@mui/material";

import "./style.css";

const CustomAlert = ({ message, type }) => {
  return (
    <Alert severity={type} className="alert-box">
        {message}
    </Alert>
  )
}

export default CustomAlert;
