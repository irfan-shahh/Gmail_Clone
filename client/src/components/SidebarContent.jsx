import { Box, Button,List,ListItem,styled } from '@mui/material'
import { CreateOutlined } from '@mui/icons-material'
import { SIDEBAR_DATA } from '../Config/sidebarConfig'
import ComposeMail from './ComposeMail'
import {routes} from '../routes/routes'

import { useState } from 'react'
import { useParams,NavLink } from 'react-router-dom'





const ComposeButton=styled(Button)`
     background: #c2e7ff;
    color: #001d35;
    border-radius: 16px;
    padding: 15px;
    min-width: 140px;
    text-transform: none;
    `
    const Container=styled(Box)`
    padding:'8px';
    & > ul{
    font-size:14px;
    font-weight:500;
    cursor:pointer;
    & > a {
    color:inherit;
    text-decoration:none;
    }
  & > a > li > svg{
     margin-right:20px
  
  }
    }
    `
    
    const SidebarContent = ({draftData,setDraftData,openDialogValue,setOpenDialogValue}) => {
      const {type}=useParams()

 

  const  onComposeClick=()=>{
        setOpenDialogValue(true)
        setDraftData(null)
    }



  return (
    <Container>

        <ComposeButton variant='contained' onClick={onComposeClick} style={{marginTop:'14px'}} > <CreateOutlined/>Compose</ComposeButton>
   
    <List>
        {SIDEBAR_DATA.map((data)=>{
            return(
               <NavLink key={data.name} to={`${routes.emails.path}/${data.name}`}>
                <ListItem style={type===data.name.toLowerCase()?{backgroundColor:'#d3e3fd', borderRadius:'0,16px,16px,0'}:{}}>
               <data.icon/> {data.title}

            </ListItem>
               </NavLink>
            )
        })}
    </List>
    <ComposeMail draftData={draftData}
    setDraftData={setDraftData}
    openDialogValue={openDialogValue}
    setOpenDialogValue={setOpenDialogValue}/>
    </Container>
  )
}

export default SidebarContent