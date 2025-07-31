import { Typography,Box } from "@mui/material"
import { useRouteError } from "react-router-dom"

const ErrorComponent = () => {
    const error=useRouteError()
    console.log(error)
  return (
    <Box>
        <Typography variant="h4" style={{marginLeft:'250px'}}>There was some error while loading this page</Typography>
    </Box>
  )
}

export default ErrorComponent;