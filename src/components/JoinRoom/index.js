// import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { forwardRef, useState } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const JoinRoom = ({ open, onClose }) => {
  const [checked, setChecked] = useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [name, setname] = useState(null);
  const [id, setid] = useState(null);
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={() => onClose('closed')}
        aria-describedby='alert-dialog-slide-description'>
        <DialogTitle>{'Join Room'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            Enter Room Id and Name to Join
          </DialogContentText>
          <br />
          <TextField
            onInput={(val) => setid(val.target.value)}
            style={{ marginBottom: 10, width: '100%' }}
            variant='filled'
            label='Room Id'
          />
          <br />
          <TextField
            onInput={(val) => setname(val.target.value)}
            style={{ marginBottom: 10, width: '100%' }}
            variant='filled'
            label='User Name'
          />
          <br />
          {/* <Typography variant='body1'>Are you a Sign User ?</Typography> */}
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={checked} onChange={handleChange} />}
              label='Are you a Sign User ?'
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>close</Button>
          <Button onClick={() => onClose(name, id, checked)}>join</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JoinRoom;
