import { useOutletContext, useLocation } from "react-router-dom";
import { Box, Button, Typography, styled } from "@mui/material";
import { ArrowBack, Delete,GetApp } from "@mui/icons-material";
import { emptyProfilePic } from "../constants/constant";
import { apiUrls } from "../services/apiUrls";
import useApi from "../hook/useAPI";

const Iconwrapper = styled(Box)`
  padding: 15px;
`;

const Subject = styled(Typography)`
  font-size: 22px;
  margin: 10px 0 20px 75px;
  display: flex;
`;

const Indicator = styled(Box)`
  font-size: 12px;
  background-color: #ddd;
  color: #222;
  padding: 2px 4px;
  margin-left: 6px;
  border-radius: 4px;
  align-self: center;
`;

const Container = styled(Box)`
  margin-left: 15px;

  display: flex;
  overflow-x: hidden;
`;

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  width: 100%;
 
  & span.email-to {
    font-size: 12px;
    color: #5f6368;
  }
`;

const InfoRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Image=styled('img')({
  borderRadius:'50%',
  width:40,
  height:40
})

const AttachmentSection=styled(Box)`
   background-color:#f8f9fa;
   padding:15px;
   border-radius:8px;
   border: 1px solid #e0e0e0;
  max-width:250px;
  margin-top:50px;
`
const AttachmentItem=styled(Box)`
     display:flex;
     align-items:center;
     padding: 10px;
     margin: 8px 0;
      border-radius: 6px;
     border: 1px solid #dadce0;
`
const AttachmentInfo=styled(Box)`
 color: #202124;
  margin-bottom: 2px;
`

const ViewMail = () => {
  const { openDrawer } = useOutletContext();
  const { state } = useLocation();
  const { email } = state;
  const moveEmailsToBinService=useApi(apiUrls.moveEmailsToBin)

  const deleteEmail=()=>{
    moveEmailsToBinService.call([email._id])
    window.history.back()
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
 const formatSize = (bytes) => {
        if (bytes === 0) return 0 + 'B'
        if (bytes < 1024) return bytes + 'B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    }

    const downloadAttachment=(attachment)=>{
       if(attachment.cloudinaryUrl){

       const link= document.createElement('a')
       link.href=attachment.cloudinaryUrl;
       link.target='-blank'
       link.download=attachment.originalName || attachment.filename||'attachment'
       document.body.appendChild(link)
       link.click()
       document.body.removeChild(link)
       }

    }

  return (
    <Box style={openDrawer ? { marginLeft: "250px", width: 'calc(100% - 250px)' } : { width: "100%" }}>
      <Iconwrapper>
        <ArrowBack onClick={() => window.history.back()} fontSize="small" color="action" />
        <Delete fontSize="small" color="action" style={{ marginLeft: 40 }} onClick={()=>deleteEmail()}/>
      </Iconwrapper>

      <Subject>
        {email.subject} <Indicator component="span">Inbox</Indicator>
      </Subject>

      <Container>
        <Box>
        <Image src={emptyProfilePic} alt="dp" />

        </Box>

        <Wrapper>
          <InfoRow>
            <Typography>
              {email.name}
              <span className="email-to"> &nbsp;&#60;{email.to}&#62;</span>
            </Typography>

            <Typography style={{ fontSize: 12, color: "#5F6368", marginRight: 20 }}>
              {formatDate(email?.date)}
            </Typography>
          </InfoRow>

          <Typography style={{marginTop:'30px'}}>{email.body}</Typography>
          {
            email.attachments && email.attachments.length>0 && (
              <AttachmentSection>
                {
                  email.attachments.map((attachment,index)=>(
                    <AttachmentItem>
                      <AttachmentInfo>
                        <Typography style={{fontSize:'12px'}}>{attachment.originalName || attachment.filename || `Attachment ${index+1}`}</Typography>
                        <Typography style={{fontSize:'10px'}}>{formatSize(attachment.size)}</Typography>
                      </AttachmentInfo>
                      <Button size="small" color="#000" onClick={()=>downloadAttachment(attachment)}>
                       <GetApp/>
                      </Button>
                      </AttachmentItem>
                  ))
                }
              </AttachmentSection>
            )
          }
        </Wrapper>
      </Container>
    </Box>
  );
};

export default ViewMail;
