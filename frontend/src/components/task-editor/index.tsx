import React, { useEffect, useId, useState } from "react"
import {
    Box, 
    Dialog, 
    IconButton, 
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AppLoadingButton from "../loading-button";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../utils/hook";
import { instance } from "../../utils/axios";
import { Delete, Search, AttachFile, Attachment } from "@mui/icons-material";
import FileUploadButton from "../upload-button";

export const TaskEditorDialogNew = (props: any) => {
    const { open, onClose, taskTitle, taskDescription, taskId, uploadedFiles} = props;

    let newDate = ''

    const dispatch = useAppDispatch()
    
    const changeDate = (value: any) =>  {
      newDate = value.toISOString()
    }

    const {
      register,
      formState: {
          errors
      }, handleSubmit
  } = useForm()
    
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

    const removeTask = async () => {
      try {
        if (taskId) {
          await instance.delete( `/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
      onClose()
    }

    const handleSubmitForm = async (data: any) => {
      try {
        if (newDate) {
          data["remember_data"] = newDate
        }

        if (taskId) {
          await instance.put( `/tasks/${taskId}`, data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
        }
        else {
          await instance.post( '/tasks', data, {headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
        }
      } catch (error) {
        console.log(error)
      }
      onClose()
    }

    const renderAttachedFile = (files: any) => {
      return files.map((element: any, index: any) => 
        <Typography 
            variant="body1" 
            sx={{fontFamily:'Poppins', marginBottom: '4px'}}>
              <span className='incitingText' onClick={() => download(element.id, element.name)}><AttachFile />{element.name}</span>
        </Typography>
      )
    }

const download = async (file_id: number, filename: string) => {
  try {
    const response = await instance.get(`/files/${file_id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      responseType: 'blob' // Добавляем правильный тип ответа
    });

    // Получаем MIME-тип из заголовков
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    
    // Создаем Blob с правильными параметрами
    const blob = new Blob([response.data], { type: contentType });
    
    // Создаем временную ссылку
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Настраиваем ссылку
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Добавляем и активируем
    document.body.appendChild(link);
    link.click();
    
    // Очистка
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

  } catch (error) {
    console.error('Download failed:', error);
  }
};

    return (
         <Dialog
         fullWidth={true}
         open={open}
         onClose={onClose}
         >
      <form className='form' onSubmit={handleSubmit(handleSubmitForm)}>
      <Box
          display='flex'
          justifyContent='center'
          alignItems='left'
          flexDirection='column'
          maxWidth={640}
          margin='auto'
          padding={5} 
          >
      <>

        <TextField
          placeholder='Название задачи' 
          defaultValue={taskTitle}
          type='text'
          variant="standard"
          slotProps={{
              input: {
                  disableUnderline: true,
              },
          }}
          error={!!errors.title}
          helperText={errors.title ? `${errors.title.message}` : ''}
          {...register('title', {
            required: 'Это обязательное поле'
          })}
          sx = {{marginBottom: 3}}
        />

        <TextField
        placeholder='Описание задачи' 
        defaultValue={taskDescription}
        type='text'
        multiline={true}
        variant="standard"
        slotProps={{
            input: {
                disableUnderline: true,
            },
        }}
        error={!!errors.description}
        helperText={errors.description ? `${errors.description.message}` : ''}
        {...register('description')}
        sx = {{marginBottom: 3}}
        />
      {renderAttachedFile(uploadedFiles)}
      <FileUploadButton
        taskId={taskId}
        accept="image/*,.pdf"
        variant="contained"
        color="primary"
        onSuccess={(response) => console.log('Upload successful:', response)}
        onError={(error) => console.error('Upload failed:', error)}
        sx = {{marginTop: "10px", marginBottom: "10px", backgroundColor: "#1900D5 !important"}}
      >
        Загрузить файл
      </FileUploadButton>
      <DateTimePickerViewRenderers />
      
      <AppLoadingButton loading={false} type="submit" sx={{ margin: 'auto', marginTop: 5, width: '60%'}} variant="contained">Сохранить</AppLoadingButton>
      <Stack direction="row" spacing={1} justifyContent={'flex-end'}>
        <IconButton onClick={removeTask} aria-label="delete">
          <Delete color="error"/>
        </IconButton>
      </Stack>
    </>
      </Box>
  </form>
       </Dialog>
    )

};

export default TaskEditorDialogNew;
