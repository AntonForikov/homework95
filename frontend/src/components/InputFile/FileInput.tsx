import React, {useRef} from 'react';
import {Button, Grid, TextField} from '@mui/material';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  name: string,
  label: string,
  fileName: string
}

const FileInput: React.FC<Props> = ({onChange, fileName, name, label}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        name={name}
        style={{display: 'none'}}
        type="file"
        onChange={onChange}
        ref={inputRef}
      />
      <Grid container direction='row' spacing={2} alignItems='center'>
        <Grid item xs>
          <TextField
            fullWidth
            label={label}
            value={fileName}
            disabled
          />
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            onClick={activateInput}
          >
            Browse
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;