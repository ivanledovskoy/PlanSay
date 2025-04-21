import { Avatar, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, InputBase, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Switch, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { pink, grey } from '@mui/material/colors';
import { Tasks } from "../../common/moks/inbox";
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { getTasks } from "../../store/thunks/tasks";
import { useStyles } from "./styles";

import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

import { Box, InputAdornment } from "@mui/material";
import {EditCalendar, AlarmOn, Inbox, Logout, PersonPinCircleOutlined, AddIcCallOutlined} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { faEllipsisV, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { FieldChangeHandlerContext } from "@mui/x-date-pickers/internals";
import { useForm } from "react-hook-form";

import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

// const renderInbox = (tasks: any) => {
//   return tasks.map((element: any) => 
//     <div>
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DesktopDateTimePicker label='K'/>
//     </LocalizationProvider>
//     <FormControlLabel 
//   control={<Checkbox 
//       sx={{
//         // color: "#1900D5",
//         '&.Mui-checked': {
//           color: "#3C3C3C",
//         },
//       }}
//       defaultChecked />} label={element.text} />
//     </div>
//   )
// }

type FontAwesomeSvgIconProps = {
  icon: any;
};

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
  (props, ref) => {
    const { icon } = props;

    const {
      icon: [width, height, , , svgPathData],
    } = icon;

    return (
      <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
        {typeof svgPathData === 'string' ? (
          <path d={svgPathData} />
        ) : (
          /**
           * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
           * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
           * of a duotone icon. 40% is the default opacity.
           *
           * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
           */
          svgPathData.map((d: string, i: number) => (
            <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
          ))
        )}
      </SvgIcon>
    );
  },
);
const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const hehe = () => {
  console.log("HAHAHA")
  return true
}

const InboxComponent = () => {
  const all_tasks = useAppSelector(state => state.tasks.all_tasks)
  const dispatch = useAppDispatch()
  const classes = useStyles()

  console.log('tasks', all_tasks)

  useEffect(() => {
    dispatch(getTasks(''))
  }, [])

  const renderInbox = (tasks: any) => {
    return tasks.map((element: any) => 
        <ListItem key={element.id}>
            <ListItemButton 
            className={classes.navItem}
            onClick={handleClickOpen}>
                <ListItemIcon>
                  <EditCalendar />
                </ListItemIcon>
                <ListItemText>
                    <Typography variant={"body1"}>{element.text}</Typography>
                </ListItemText>
            </ListItemButton>
        </ListItem>
    )
}

const [open, setOpen] = React.useState(false);
const [selectedValue, setSelectedValue] = React.useState(emails[1]);

const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = (value: string) => {
  setOpen(false);
};

function changehehe(value: any, context: any)  {
  console.log(value)
  console.log(context)
}

function DateTimePickerViewRenderers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="Выберите дату и время"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          closeOnSelect={true}
          slotProps={{
            day: {
              sx: () => ({
                '&.MuiPickersDay-root.Mui-selected': {
                backgroundColor: "#1900D5",
                },
                ':hover': {
                  color: '#fff',
                  backgroundColor: "#1900D5",
                  borderColor: "#1900D5",
                },
                '& .MuiPaper-root': {
                  color: '#fff',
                  backgroundColor: "#1900D5",
                  borderColor: "#1900D5",
                },
              }),
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

function MaxWidthDialog(props: any) {
  const { onClose, selectedValue, open } = props;
  return (
    <React.Fragment>
      <Dialog
        fullWidth={false}
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          <InputBase
            defaultValue="Погулять с друзьями"
            placeholder="Название"
            required={true}
            inputProps={{ 'aria-label': 'naked' }}
            sx={{
              fontWeight: "bolder",
            }}
            />
        </DialogTitle>
        <DialogContent>
          <InputBase
            defaultValue="Взять с собой зонтик"
            placeholder="Описание"
            inputProps={{ 'aria-label': 'naked' }}
            multiline={true}
          />
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
              padding: '50px 0px 0px 0px'
            }}
          >
            <DateTimePickerViewRenderers />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{color: 'white'}}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

// function TaskDescription(props: SimpleDialogProps) {
//   const { onClose, selectedValue, open } = props;

//   const handleClose = () => {
//     onClose(selectedValue);
//   };

//   const handleListItemClick = (value: string) => {
//     onClose(value);
//   };

//   return (
//     <Dialog onClose={handleClose} open={open}>
//       <DialogTitle>Выберите дату и время</DialogTitle>
//       <List sx={{ pt: 0 }}>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DesktopDateTimePicker/>
//         </LocalizationProvider>
//         {emails.map((email) => (
//           <ListItem disablePadding key={email}>
//             <ListItemButton onClick={() => handleListItemClick(email)}>
//               <ListItemAvatar>
//                 <Avatar>
//                   <PersonPinCircleOutlined />
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText primary={email} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//         <ListItem disablePadding>
//           <ListItemButton
//             autoFocus
//             onClick={() => handleListItemClick('addAccount')}
//           >
//             <ListItemAvatar>
//               <Avatar>
//                 <AddIcCallOutlined />
//               </Avatar>
//             </ListItemAvatar>
//             <ListItemText primary="Add account" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Dialog>
//   );
// }
  
  return (
    <div>
      <h1>Inbox Component</h1>
      <FormGroup>
        {renderInbox(all_tasks)}
      </FormGroup>

      <MaxWidthDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  )
};

export default InboxComponent;
