
import { Suspense, useState } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

import { Outlet } from "react-router-dom"
import SuspenseLoader from "../components/common/SuspenseLoader"

const Main = () => {
    const[openDrawer,setOpenDrawer]=useState(true)
     const[openDialogValue,setOpenDialogValue]=useState(false)
const [draftData, setDraftData] = useState(null);

 const toggleDrawer=()=>{
    setOpenDrawer(prevState=>!prevState)
 }
  return (
    <>
    <Header toggleDrawer={toggleDrawer} />

    <Sidebar openDrawer={openDrawer}
    openDialogValue={openDialogValue}
    setOpenDialogValue={setOpenDialogValue}
    draftData={draftData}
    setDraftData={setDraftData}/>
    
    <Suspense fallback={<SuspenseLoader/>}>
    <Outlet context={{ 
    openDrawer,
    openDialogValue,
    setOpenDialogValue,
    draftData,
    setDraftData
    }}/>
    </Suspense>
    
    </>
  )
}

export default Main