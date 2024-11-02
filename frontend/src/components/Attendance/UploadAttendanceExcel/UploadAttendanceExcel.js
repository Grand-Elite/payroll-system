import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadAttendanceFile } from '../../../services/api';
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Paper,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';


function UploadAttendanceExcel() {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
  
    const onDrop = (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setUploadProgress(0); // Reset progress when a new file is selected
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: '.csv, .xlsx',
      multiple: false,
    });
  
    const handleUpload = async () => {
      if (!file) {
        alert("Please select a file first.");
        return;
      }
  
      try {
        const result = await uploadAttendanceFile(file, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        });
        setSuccessMessage("File uploaded successfully!");
        console.log(result);
      } catch (error) {
        alert("Failed to upload file.");
      }
    };
  
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={3}
        component={Paper}
        elevation={3}
        style={{ maxWidth: 400, margin: 'auto' }}
      >
        <Typography variant="h5" gutterBottom>
          Upload Fingerprint Attendance File
        </Typography>
  
        {/* Dropzone for drag and drop file upload */}
        <Box
          {...getRootProps()}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={3}
          mt={2}
          width="100%"
          height={150}
          border="2px dashed #3f51b5"
          borderRadius={4}
          style={{
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload fontSize="large" color="primary" />
          {isDragActive ? (
            <Typography variant="body1" color="primary">
              Drop the file here...
            </Typography>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Drag & drop a file here, or click to select one
            </Typography>
          )}
          {file && (
            <Typography variant="body2" color="textSecondary" mt={1}>
              Selected File: {file.name}
            </Typography>
          )}
        </Box>
  
        <Box mt={3} width="100%">
          <Button
            onClick={handleUpload}
            variant="contained"
            color="secondary"
            fullWidth
            disabled={!file}
          >
            Upload
          </Button>
          {uploadProgress > 0 && (
            <Box mt={2}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="textSecondary" align="center">
                {uploadProgress}%
              </Typography>
            </Box>
          )}
          {successMessage && (
          <Typography variant="body2" color="primary" align="center" mt={2}>
            {successMessage}
          </Typography>
        )}
        </Box>
      </Box>
    );
  };

export default UploadAttendanceExcel;