import React, { useState } from "react"
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
import { Delete, AttachFile, Share, ContentCopy } from "@mui/icons-material";
import FileUploadButton from "../upload-button";
import md5 from 'crypto-js/md5';
import { getCalendar, getInbox, getToday } from "../../store/thunks/tasks";

export const TaskEditorDialogNew = (props: any) => {
    const { open, onClose, taskTitle, taskDescription, taskId, uploadedFiles} = props;

    let newDate = ''

    const dispatch = useAppDispatch()
    
    const changeDate = (value: any) =>  {
      newDate = value.toISOString()
    }

    // Инициализируем состояние с учетом флага shared
    const [sharedFileIds, setSharedFileIds] = useState<number[]>(() => 
        (uploadedFiles || [])
            .filter((file: any) => file.shared === true)
            .map((file: any) => file.id)
    );

  const [copiedFiles, setCopiedFiles] = useState<{ [key: number]: boolean }>({});

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
          await instance.delete( `/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
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
          await instance.put( `/tasks/${taskId}`, data, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
      (window.location.pathname === "/inbox") ? dispatch(getInbox(localStorage.getItem('token'))) : 
              (window.location.pathname === "/today") ?  dispatch(getToday(localStorage.getItem('token'))) : 
              dispatch(getCalendar(localStorage.getItem('token')));
        }
        else {
          await instance.post( '/tasks', data, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
      (window.location.pathname === "/inbox") ? dispatch(getInbox(localStorage.getItem('token'))) : 
              (window.location.pathname === "/today") ?  dispatch(getToday(localStorage.getItem('token'))) : 
              dispatch(getCalendar(localStorage.getItem('token')))
        }
      } catch (error) {
        console.log(error)
      }
      onClose()
    }

  const handleDeleteFile = async (fileId: number) => {
    try {
      await instance.delete(`/files/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
      });
      (window.location.pathname === "/inbox") ? dispatch(getInbox(localStorage.getItem('token'))) : 
              (window.location.pathname === "/today") ?  dispatch(getToday(localStorage.getItem('token'))) : 
              dispatch(getCalendar(localStorage.getItem('token')));
    } catch (error) {
      console.error('File deletion error:', error);
    }
  };

const renderAttachedFile = (files: any) => {

  const handleCopyLink = async (fileId: number, fileName: string) => {
    try {
      const hash = md5(`${fileId}${fileName}`).toString();
      const fileLink = `${window.location.origin}/files/${hash}`;
      await navigator.clipboard.writeText(fileLink);
      setCopiedFiles(prev => ({ ...prev, [fileId]: true }));
      setTimeout(() => {
        setCopiedFiles(prev => ({ ...prev, [fileId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const toggleShare = (fileId: number, sharedValue: boolean) => {
    setSharedFileIds(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId) 
        : [...prev, fileId]
    );
    const newValue = !sharedFileIds.includes(fileId)
      try {
        instance.post( `/files/${fileId}?is_shared=${newValue}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
      } catch (error) {
        console.log(error)
      }
  };

  return files.map((element: any) => (
    <Typography 
      key={element.id}
      variant="body1" 
      sx={{
        fontFamily: 'Poppins',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <span 
        className='incitingText' 
        onClick={() => download(element.id, element.name)}
        style={{ flexGrow: 1 }}
      >
        <AttachFile fontSize="small" />
        {element.name}
      </span>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {sharedFileIds.includes(element.id) && (
          <IconButton
            aria-label="copy-link"
            onClick={() => handleCopyLink(element.id, element.name)}
            sx={{ 
              color: copiedFiles[element.id] ? 'green' : '#1900f5',
              '&:hover': {
                backgroundColor: 'rgba(247, 247, 247, 0.08)'
              }
            }}
          >
            {copiedFiles[element.id] ? (
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#1900f5' }}>
                Скопировано!
              </Typography>
            ) : (
              <ContentCopy fontSize="small" />
            )}
          </IconButton>
        )}

        <IconButton 
          aria-label="share"
          onClick={() => toggleShare(element.id, element.shared)}
          sx={{ 
            color: '#1900f5',
            '&:hover': {
              backgroundColor: 'rgba(247, 247, 247, 0.08)'
            }
          }}
        >
          <Share fontSize="small" />
        </IconButton>

        <IconButton 
          aria-label="delete"
          onClick={() => handleDeleteFile(element.id)}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.04)'
            }
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    </Typography>
  ));
};

const download = async (file_id: number, filename: string) => {
  try {
    const response = await instance.get(`/files/${file_id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        onSuccess={(window.location.pathname === "/inbox") ? () => dispatch(getInbox(localStorage.getItem('token'))) : 
                    (window.location.pathname === "/today") ? () => dispatch(getToday(localStorage.getItem('token'))) : 
                    () => dispatch(getCalendar(localStorage.getItem('token')))}
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
