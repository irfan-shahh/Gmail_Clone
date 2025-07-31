import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { apiUrls } from '../services/apiUrls'
import useApi from "../hook/useAPI";
import { useEffect } from "react";
import { Box, List, Checkbox } from '@mui/material'
import { DeleteOutline,} from '@mui/icons-material';
import Email from "./Email";
import { useState } from "react";
import NoMail from "./common/NoMail";
import { EMPTY_TABS } from "../constants/constant";

const Emails = () => {
  const {openDrawer}=useOutletContext()
  const {type}=useParams()

  const [selectedEmails,setSelectedEmails]=useState([])
  const [refreshScreen,setRefreshScreen]=useState(false)
  const [starredEmails,setStarredEmails]=useState(false)

  const getEmailService=useApi(apiUrls.getEmailFromType)
  const deleteEmailService=useApi(apiUrls.deleteEmails)
  const moveEmailsToBinService=useApi(apiUrls.moveEmailsToBin)
  useEffect(()=>{
    getEmailService.call({},type)
  },[type,refreshScreen])

  const selectAllEmails=(e)=>{
    if(e.target.checked){

      const emails=  getEmailService?.response?.map(email=>email._id)
      setSelectedEmails(emails)
    }
    else{
      setSelectedEmails([])
    }

  }

  const deleteSelectedEmails=(e)=>{
      if(type==='bin'){
        deleteEmailService.call(selectedEmails)
      }
      else{
        moveEmailsToBinService.call(selectedEmails)
      }
      setRefreshScreen(prevstate=>!prevstate)
  }

  return (
    <Box style={openDrawer? {marginLeft:'250px',width:'calc(100% - 250px)'}:{width:'100%'}}>
     <Box style={{padding:'20px 10px 0 10px' ,display:'flex', alignItems:'center'}}>
      <Checkbox onChange={(e)=>selectAllEmails(e)}/>
      <DeleteOutline onClick={(e)=>deleteSelectedEmails(e)}/>
     </Box>
     <List>
      {getEmailService?.response?.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(email=>(
        <Email key={email._id}
         email={email}
          selectedEmails={selectedEmails}
          setSelectedEmails={setSelectedEmails}
           starredEmails={starredEmails}
           setRefreshScreen={setRefreshScreen}/>
      ))}
      
      
     </List>
     {
        getEmailService?.response?.length===0 && 
        <NoMail message={EMPTY_TABS[type]}/>
      }
     
    </Box>
  )
}

export default Emails;