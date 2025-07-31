import {AppBar,Toolbar,styled,InputBase,Box} from '@mui/material'
import { Menu,Search,Tune,HelpOutlined,SettingsOutlined,AccountCircleOutlined,AppsOutlined} from '@mui/icons-material';
import { gmailLogo } from '../constants/constant'; 


 const StyledAppBar=styled(AppBar)`
 background:#f5F5F5;
 box-shadow:none;
`
const SearchWrapper=styled(Box)`
background:#EAF1FB;
display:flex;
align-items:center;
justify-content:space-between;
border:8px;
margin-left:80px;
min-width:690px;
max-width:720px;
padding:0 20px;
height:48px;
& > div{
width:100%;
padding:10px;

}
`
const OptionsWrapper=styled(Box)`
width:100%;
display:flex;
justify-content:end;
& > svg{
margin-left:20px;

}


`
const Header = ({toggleDrawer}) => {
  return (
    <div>
        <StyledAppBar position='static'>
            <Toolbar>
                <Menu color='action' onClick={toggleDrawer}/>
                <img src={gmailLogo} alt='logo' style={{ width:110, marginLeft:15}}/>
                <SearchWrapper>
                   <Search color='action'/>
                   <InputBase  placeholder='Search mails'/>
                   <Tune color='action'/>
                </SearchWrapper>
                < OptionsWrapper>
                    <HelpOutlined color='action'/>
                    <SettingsOutlined color='action'/>
                    <AppsOutlined color='action'/>
                    <AccountCircleOutlined color='action'/>
                </ OptionsWrapper>
            </Toolbar>
        </StyledAppBar>
    </div>
  )
}

export default Header