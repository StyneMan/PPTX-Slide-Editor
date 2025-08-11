import './App.css'
import {
  Box,
  Container,
  CssBaseline,
  useMediaQuery,
  useTheme
} from '@mui/material'
import PPTParser from './components/parser/ppt-parser'
import ThumbnailRail from './components/thumbnails'
import Toolbar from './components/toolbar'
import CanvasEditor from './components/canvas/canvas_editor'
import type { RootState } from './store'
import { useAppSelector } from './store/hooks'
import { useState, useEffect } from 'react'

function App () {
  const document = useAppSelector((state: RootState) => state.document.present)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(false)
    }
  }, [isMobile])

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth='xl'
        sx={{
          py: 2,
          px: { xs: 1, sm: 2, md: 4 },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {!document ? (
          <PPTParser />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              flex: 1,
              overflow: 'hidden'
            }}
          >
            {/* Mobile drawer toggle button */}
            {isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}
              >
                <Toolbar />
                <Box
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    display: { md: 'none' }
                  }}
                >
                  {drawerOpen ? 'Hide Thumbnails' : 'Show Thumbnails'}
                </Box>
              </Box>
            )}

            {/* Thumbnail rail - hidden on mobile when drawer is closed */}
            <Box
              sx={{
                width: { xs: '100%', md: 150 },
                flexShrink: 0,
                display: {
                  xs: drawerOpen ? 'block' : 'none',
                  md: 'block'
                },
                overflowY: 'auto'
              }}
            >
              <ThumbnailRail />
            </Box>

            {/* Main content area */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                gap: 1
              }}
            >
              {/* Desktop toolbar */}
              {!isMobile && <Toolbar />}

              {/* Canvas area */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  position: 'relative',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  overflow: 'auto'
                }}
              >
                <CanvasEditor />
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </>
  )
}

export default App
