import { Drawer,} from "@mui/material"
import SidebarContent from "./SidebarContent"


const Sidebar = ({openDrawer,draftData,setDraftData,openDialogValue,setOpenDialogValue}) => {

    
    return (
     
    <Drawer anchor="left" 
    variant="persistent"
    open={openDrawer}
    // onClose={toggleDrawer}
    
    hideBackdrop={true}
    ModalProps={
        {keepMounted:true}
    }
    sx={{
        '& .MuiDrawer-paper':{
            width:250,
            background:'#f5F5F5',
            marginTop:'54px',
            height:'calc(100vh-64px)',
            borderRight:'none',

        }
    }}>
       <SidebarContent
       draftData={draftData}
       setDraftData={setDraftData}
       openDialogValue={openDialogValue}
       setOpenDialogValue={setOpenDialogValue}/> 
     
     </Drawer>
  )
}

export default Sidebar