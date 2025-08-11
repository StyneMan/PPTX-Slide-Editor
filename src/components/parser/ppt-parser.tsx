import React, { useCallback } from 'react'
import { Box, Paper, Typography, Button } from '@mui/material'
import { Upload } from '@mui/icons-material'
import { parsePPTX } from '../../utils/ppt_parser'
import { loadDocument, setError, setLoading } from '../../store/slices/document'
import { useAppDispatch } from '../../store/hooks'

const PPTParser: React.FC = () => {
  const dispatch = useAppDispatch()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("FILE CHANGE LISTENER HERE ::::::");
      
      const file = e.target.files?.[0]
      if (!file) return

      dispatch(setLoading(true))
      try {
        console.log("FILE PICKED LOGGED ::: ", file);
        
        const document = await parsePPTX(file)
        console.log("PICKED DOCUMENT ::: ", document);
        
        dispatch(loadDocument(document))
      } catch (error) {
        console.error('Error parsing PPTX:', error)
        dispatch(setError('Failed to parse PPTX file'))
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      const file = e.dataTransfer.files?.[0]
      if (!file || !file.name.endsWith('.pptx')) return

      try {
        const document = await parsePPTX(file)
        loadDocument(document)
      } catch (error) {
        console.error('Error parsing PPTX:', error)
      }
    },
    []
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload sx={{ fontSize: 48, color: 'action.active' }} />
        <Typography variant='h6'>Upload PPTX File</Typography>
        <Typography variant='body1' color='primary'>
          Drag and drop your PowerPoint file here or
        </Typography>
        <Button
          variant='contained'
          onClick={() => fileInputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type='file'
          accept='.pptx'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Paper>
    </Box>
  )
}

export default PPTParser
