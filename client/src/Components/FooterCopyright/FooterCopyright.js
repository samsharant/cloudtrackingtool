import React from "react";
import { Box } from "@mui/material";
import { Link as RedirectTo } from "react-router-dom";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { productName, companyName } from "../../constants";

function FooterCopyright(props) {
    const { color, leftSpace, width, centralize, type, nonSticky, topSpace, bottomSpace } = props;
    return (
        <Box
              sx={{
                position: nonSticky ? 'static' : 'absolute',
                bottom: '0',
                width: width,
                height: '5%',
                paddingLeft: leftSpace,
                display: 'flex',
                justifyContent: centralize ? 'center' : 'flex-start',
                marginTop: topSpace ? topSpace : '0',
                bottomSpace: bottomSpace ? bottomSpace : '0'
              }}
        >
        <Typography
        variant="body2"
        // align="left "
        >
        <span style={{color: color}}>{"© "}</span>
        <RedirectTo to="/">
            <Link href="#" sx={{color: color, textDecoration: 'none'}}>{ (type==null || type=='' || type=='product') ? productName : companyName }</Link>
        </RedirectTo>{" "}
        <span style={{color: '#B98472'}}>{new Date().getFullYear()}</span>
        </Typography>
        </Box>
    );
}

export default FooterCopyright;
