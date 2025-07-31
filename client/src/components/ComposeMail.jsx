import { useEffect, useState } from 'react'
import { Dialog, Box, Typography, styled, InputBase, TextField, Button, IconButton, } from '@mui/material'
import { AttachFile, Close, DeleteOutline, } from '@mui/icons-material'

import useApi from '../hook/useAPI'
import { apiUrls } from '../services/apiUrls'

const dialogStyle = {
    height: '90%',
    width: '80%',
    maxHeight: '100%',
    maxWidth: '100%',
    boxShadow: 'none',
    borderRadius: '10px,10px 0 0',
}
const Header = styled(Box)`
  display:flex;
  justify-content:space-between;
  padding:10px 15px;
   background: #f2f6fc;
   & >p{
   font-size:14px;
   font-weight:500;
   }
`

const ReciepientWrapper = styled(Box)`
 display:flex;
 flex-direction:column;
 padding:0px 15px;
 & > div{
  font-size: 14px;
  border-bottom: 1px solid #F5F5F5;
  margin-top:10px;
 }

`

const Footer = styled(Box)`
    display: flex;
    padding: 10px 15px;
    align-items: center;
`
const SendButton = styled(Button)`
    background: #0B57D0;
    color: #fff;
    font-weight: 500;
    text-transform: none;
    border-radius: 18px;
    width: 100px;
`

const AttachmentItem = styled(Box)`
   display:flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  margin: 5px 0;
  background: #f5f5f5;
  border-radius: 4px;
 

`
const FileMeta = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Attachmentcontrol = styled(Box)`

`


const ComposeMail = ({ draftData, setDraftData, openDialogValue, setOpenDialogValue }) => {
    const [data, setData] = useState({})
    const [attachments, setAttachments] = useState([])

    const sentEmailService = useApi(apiUrls.saveSentEmails)
    const sendEmailService = useApi(apiUrls.sendEmail)
    const saveDraftService = useApi(apiUrls.saveDraftEmails)

    const onvalueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })

    }
    const handleFileSelect = (e) => {
        const selectedFiles = [...e.target.files]
        const processedFiles = selectedFiles.map(file => ({
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size
        }))
        setAttachments(prev => [...prev, ...processedFiles])

    }
    const formatSize = (bytes) => {
        if (bytes === 0) return 0 + 'B'
        if (bytes < 1024) return bytes + 'B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    }
    const removeAttachment = (id) => {
        setAttachments(prev => prev.filter(att => att.id !== id))
    }


    useEffect(() => {
        if (draftData) {
            setData({
                to: draftData.to || '',
                subject: draftData.subject || '',
                body: draftData.body || ''
            })
        }
        else {
            setData({})
        }
    }, [draftData])

    const closeComposeMail = (e) => {
        e.preventDefault();
        const payload = {
            to: data.to,
            from: process.env.REACT_APP_FROMEMAIL,
            subject: data.subject,
            body: data.body,
            date: new Date(),
            image: '',
            name: process.env.REACT_APP_USERNAME,
            starred: false,
            type: 'draft',
           
        }
        saveDraftService.call(payload)
        setDraftData(payload)

        if (!saveDraftService.error) {
            setOpenDialogValue(false)
            setData({})
            setAttachments([])
        }
        else {

        }
        setOpenDialogValue(false)

    }
    const sendMail = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('to', data.to);
        formData.append('from', process.env.REACT_APP_FROMEMAIL);
        formData.append('subject', data.subject);
        formData.append('body', data.body);
        formData.append('date', new Date().toISOString());
        formData.append('image', '');
        formData.append('name', process.env.REACT_APP_USERNAME);
        formData.append('starred', false);
        formData.append('type', 'sent');

        attachments.forEach(attachment => {
            formData.append('attachments', attachment.file)
        })

        const emailData = {
        to: data.to,
        from: process.env.REACT_APP_FROMEMAIL,
        subject: data.subject,
        body: data.body,
        date: new Date(),
        image: '',
        name: process.env.REACT_APP_USERNAME,
        starred: false,
        type: 'sent',
        bin: false,
        attachments: [] 
    }
        try {
            await sendEmailService.call(formData)

            alert('emailsent')
        }
        catch (error) {
            console.log(error)
            alert('error')
        }

        if (!sentEmailService.error) {
            setOpenDialogValue(false)
            setData({})
            setAttachments([])
        }
        else {

        }
        setOpenDialogValue(false);
    }
    return (
        <Dialog open={openDialogValue}
            PaperProps={{ sx: dialogStyle }}>
            <Header>
                <Typography>New message</Typography>
                <Close fontSize='small' onClick={(e) => closeComposeMail(e)} />

            </Header>
            < ReciepientWrapper>
                <InputBase placeholder='Reciepient' onChange={(e) => onvalueChange(e)} name='to' value={data.to || ''}></InputBase>
                <InputBase placeholder='Subject' onChange={(e) => onvalueChange(e)} name='subject' value={data.subject || ''}></InputBase>
            </ ReciepientWrapper>
            <TextField
                multiline
                rows={12}
                sx={{ ' & .MuiOutlinedInput-notchedOutline': { border: 'none' } }}

                onChange={(e) => onvalueChange(e)} name='body' value={data.body || ''} />
            {
                attachments.length > 0 && (
                    <>
                        <Box>
                            {
                                attachments.map((attachment) => (
                                    <AttachmentItem>
                                        <FileMeta>
                                            <Typography fontSize='12px' >{attachment.name}</Typography>
                                            <Typography fontSize='12px' color='primary'>{formatSize(attachment.size)}</Typography>
                                        </FileMeta>
                                        <IconButton>
                                            <Close fontSize='small' onClick={() => removeAttachment(attachment.id)} />
                                        </IconButton>
                                    </AttachmentItem>

                                ))
                            }
                        </Box>
                    </>
                )
            }
            <Footer>
                <SendButton onClick={(e) => sendMail(e)}>Send</SendButton>

                <Attachmentcontrol>
                    <InputBase type='file'
                        id='attachment-input'
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                    <label htmlFor='attachment-input'>
                        <IconButton component='span'>
                            <AttachFile />
                        </IconButton>
                    </label>

                </Attachmentcontrol>
                <DeleteOutline onClick={() => setOpenDialogValue(false)} style={{ marginLeft: 'auto' }} />
            </Footer>

        </Dialog>
    )
}

export default ComposeMail;