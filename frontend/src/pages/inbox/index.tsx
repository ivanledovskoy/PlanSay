import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react"
import { pink, grey } from '@mui/material/colors';
import { Tasks } from "../../common/moks/inbox";

const renderInbox = (tasks: any) => {
  return tasks.map((element: any) => 
    <FormControlLabel control={<Checkbox 
      sx={{
        // color: "#1900D5",
        '&.Mui-checked': {
          color: "#3C3C3C",
        },
      }}
      defaultChecked />} label={element.text} />
  )
}

const InboxComponent = () => {
  return (
    <div>
        <h1>Inbox Component</h1>
        <FormGroup>
          {renderInbox(Tasks)}
        </FormGroup>
    </div>
  )
};

export default InboxComponent;
