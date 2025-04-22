import React, { useEffect, useState } from "react"
import {
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Drawer, 
    InputBase, 
    List, 
    ListItem, 
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material'
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../flex-between";
import { accountMenu, navMenu } from "../../common/moks/navigate";
import { tokens } from "../../theme";
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TaskEditorDialogNew = (props: any) => {
    const { onClose_props, open_props, selectedElement_props } = props;
    
    const changeTitle = (value: any) =>  {
      console.log(value.target.value)
    }
    
    const changeDescription = (value: any) =>  {
      console.log(value.target.value)
    }
    
    const changeDate = (value: any) =>  {
      console.log(value)
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
              onAccept={changeDate}
            />
          </DemoContainer>
        </LocalizationProvider>
      );
    }

    
    const taskTitle = selectedElement_props ? selectedElement_props.title : ''
    const taskDescription = selectedElement_props ? selectedElement_props.description.value : ''
    
    return (
    <React.Fragment>
        <Dialog
        fullWidth={false}
        open={open_props}
        onClose={onClose_props}
        >
        <DialogTitle>
            <InputBase
            defaultValue={taskTitle}
            placeholder="Название"
            required={true}
            inputProps={{ 'aria-label': 'naked' }}
            onChange={changeTitle}
            sx={{
                fontWeight: "bolder",
            }}
            />
        </DialogTitle>
        <DialogContent>
            <InputBase
            defaultValue={taskDescription}
            placeholder="Описание"
            inputProps={{ 'aria-label': 'naked' }}
            multiline={true}
            onChange={changeDescription}
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
            <Button onClick={onClose_props} sx={{color: 'white'}}>Закрыть</Button>
        </DialogActions>
        </Dialog>
    </React.Fragment>
    );
};

export default TaskEditorDialogNew;
