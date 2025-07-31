
import { Box ,styled,Checkbox,ListItem,Typography} from "@mui/material"
import {StarBorder,Star} from '@mui/icons-material'
import {useNavigate,useOutletContext} from 'react-router-dom'
import { routes } from "../routes/routes"
import { apiUrls } from "../services/apiUrls"
import useApi from "../hook/useAPI"



const Wrapper=styled(ListItem)`
  padding: 0 0 0 10px;
    background: #f2f6fc;
    cursor: pointer;
    display:flex;
    align-items:center;
    & > div{
    display:flex;
    width:100%;
    }
    & > div p{
    font-size:14px;
    }
`

const Date=styled(Typography)`
margin-left:auto;
color: '#5F6368';
margin-right:20px;

`

const EmailContent = styled(Box)`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  min-width: 0;
`
const SubjectBody = styled(Typography)`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 30px;

`
const AttachmentIndicator = styled(Box)`
  display: flex;
  align-items: center;
  margin-right: 10px;
`




const Email = ({email,selectedEmails,setRefreshScreen,setSelectedEmails}) => {
  
  const { setOpenDialogValue, setDraftData,draftData } = useOutletContext();

  const  toggleStarredService=useApi(apiUrls.toggleStarredEmails)
  const navigate=useNavigate()

  const toggleStarredMails=()=>{
    toggleStarredService.call({id:email._id,value:!email.starred})
    setRefreshScreen(prevstate=>!prevstate)
  }

  const onvalueChange=()=>{
       if(selectedEmails.includes(email._id)){
        setSelectedEmails(prevstate=>prevstate.filter(id =>id !== email._id))
       }
       else{
        setSelectedEmails(prevstate=> [...prevstate, email._id])
       }
  }

  const formatDate=(inputdate)=>{
   if (!inputdate) return '';
  const now=new window.Date()
  const date=new window.Date(inputdate)
  const diff=now-date;
  const diffHrs=diff/(1000*60*60);
  if(diffHrs<24){
    return date.toLocaleTimeString('default',{hour:'2-digit',minute:'2-digit',hour12:true})
  }
  else{
    return date.toLocaleDateString('default',{day:'numeric',month:'short',year:'numeric'})
  }

}
  return (
    <Wrapper>
       <Checkbox size="small" checked={selectedEmails.includes(email._id)}
       onChange={()=>onvalueChange()} />
       {
        email.starred ? <Star size='small'  style={{marginRight:10,color:"#FDDA0D"}} onClick={()=>toggleStarredMails()}/> :
        <StarBorder size='small'  style={{marginRight:10}} onClick={()=>toggleStarredMails()}/>
       }
      

       <EmailContent onClick={()=>{
           if(email.type==='draft'){
              setDraftData(email)
              setOpenDialogValue(true)
           }
           else{
            navigate(routes.view.path,{state:{email:email}})
           }
       }}>
        <Typography style={{width:200,overflow:'hidden',marginLeft:10} }>{email?.name}</Typography>
        <SubjectBody>
          <span style={{ fontWeight: 600 }}>{email?.subject}</span>
          {email?.body && <span style={{ fontWeight: 400 }}> - {email?.body}</span>}
        </SubjectBody>
      
        <Date>
           {formatDate(email?.date)}
        </Date>
       </EmailContent>
    </Wrapper>
  )
}

export default Email