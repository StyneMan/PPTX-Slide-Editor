import React from 'react'
import { Box, Paper, IconButton } from '@mui/material'
import { Slideshow, Add } from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { setCurrentSlideIndex, addSlide } from '../../store/slices/document'

const ThumbnailRail: React.FC = () => {
  const document = useAppSelector(state => state.document.document)
  const currentSlideIndex = useAppSelector(
    state => state.document.currentSlideIndex
  )
  const dispatch = useAppDispatch()

  if (!document) return null

  console.log('DOC LIDES:: ', document.slides)

  return (
    <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {document.slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            width: 100,
            height: 75,
            bgcolor: '#f5f5f5',
            border:
              index === currentSlideIndex
                ? '2px solid #1976d2'
                : '1px solid #ddd',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => dispatch(setCurrentSlideIndex(index))}
        >
          <Slideshow sx={{ color: 'action.active' }} />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              textAlign: 'center',
              fontSize: 12,
              py: 0.5
            }}
          >
            {index + 1}
          </Box>
        </Box>
      ))}
      <IconButton
        onClick={() => dispatch(addSlide())}
        sx={{ alignSelf: 'center' }}
      >
        <Add />
      </IconButton>
    </Paper>
  )
}

export default ThumbnailRail
