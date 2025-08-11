import React from 'react'
import {
  Box,
  Paper,
  Button,
  ButtonGroup,
  Divider,
  Tooltip,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  removeObject,
  bringObjectForward,
  sendObjectBackward,
  addSlide,
  removeSlide,
  duplicateObject,
  pasteObject,
  undo,
  redo,
  zoomIn,
  zoomOut,
  resetZoom,
  copyObject
} from '../../store/slices/document'
import {
  Delete,
  Undo,
  Redo,
  MoveUp,
  MoveDown,
  ZoomIn,
  ZoomOut,
  FitScreen,
  ContentCopyOutlined,
  ContentCopy,
  ContentPaste,
  Add,
  Remove,
  MoreVert
} from '@mui/icons-material'
import type { RootState } from '../../store'

const Toolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const selectedObjectId = useAppSelector(
    (state: RootState) => state.document.selectedObjectId
  )
  const { clipboard, currentSlideIndex } = useAppSelector(
    (state: RootState) => state.document
  )
  const canUndo = useAppSelector(
    (state: RootState) => state.document.past.length > 0
  )
  const canRedo = useAppSelector(
    (state: RootState) => state.document.future.length > 0
  )

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    if (selectedObjectId) {
      dispatch(removeObject(selectedObjectId))
    }
    handleClose()
  }

  const handleBringForward = () => {
    if (selectedObjectId) {
      dispatch(bringObjectForward(selectedObjectId))
    }
    handleClose()
  }

  const handleSendBackward = () => {
    if (selectedObjectId) {
      dispatch(sendObjectBackward(selectedObjectId))
    }
    handleClose()
  }

  const handleAddSlide = () => {
    dispatch(addSlide())
  }

  const handleRemoveSlide = () => {
    dispatch(removeSlide(currentSlideIndex))
    handleClose()
  }

  const handleDuplicate = () => {
    if (selectedObjectId) {
      dispatch(duplicateObject(selectedObjectId))
    }
    handleClose()
  }

  const handleCopy = () => {
    if (selectedObjectId) {
      dispatch(copyObject(selectedObjectId))
    }
    handleClose()
  }

  const handlePaste = () => {
    if (clipboard) {
      dispatch(pasteObject())
    }
    handleClose()
  }

  if (isMobile) {
    return (
      <Paper sx={{ p: 1, mb: 2, overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Main visible buttons */}
          <ButtonGroup variant='contained' size='small'>
            <Tooltip title='Undo'>
              <IconButton onClick={() => dispatch(undo())} disabled={!canUndo}>
                <Undo fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Redo'>
              <IconButton onClick={() => dispatch(redo())} disabled={!canRedo}>
                <Redo fontSize='small' />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation='vertical' flexItem />

          <ButtonGroup variant='contained' size='small'>
            <Tooltip title='Delete'>
              <IconButton onClick={handleDelete} disabled={!selectedObjectId}>
                <Delete fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Add Slide'>
              <IconButton onClick={handleAddSlide}>
                <Add fontSize='small' />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation='vertical' flexItem />

          {/* More options menu */}
          <ButtonGroup variant='contained' size='small'>
            <IconButton onClick={handleClick}>
              <MoreVert fontSize='small' />
            </IconButton>
          </ButtonGroup>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleDuplicate} disabled={!selectedObjectId}>
              <ListItemIcon>
                <ContentCopyOutlined fontSize='small' />
              </ListItemIcon>
              <ListItemText>Duplicate</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleCopy} disabled={!selectedObjectId}>
              <ListItemIcon>
                <ContentCopy fontSize='small' />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem onClick={handlePaste} disabled={!clipboard}>
              <ListItemIcon>
                <ContentPaste fontSize='small' />
              </ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleBringForward} disabled={!selectedObjectId}>
              <ListItemIcon>
                <MoveUp fontSize='small' />
              </ListItemIcon>
              <ListItemText>Bring Forward</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSendBackward} disabled={!selectedObjectId}>
              <ListItemIcon>
                <MoveDown fontSize='small' />
              </ListItemIcon>
              <ListItemText>Send Backward</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleRemoveSlide}
              disabled={currentSlideIndex === 0}
            >
              <ListItemIcon>
                <Remove fontSize='small' />
              </ListItemIcon>
              <ListItemText>Remove Slide</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => dispatch(zoomIn())}>
              <ListItemIcon>
                <ZoomIn fontSize='small' />
              </ListItemIcon>
              <ListItemText>Zoom In</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => dispatch(zoomOut())}>
              <ListItemIcon>
                <ZoomOut fontSize='small' />
              </ListItemIcon>
              <ListItemText>Zoom Out</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => dispatch(resetZoom())}>
              <ListItemIcon>
                <FitScreen fontSize='small' />
              </ListItemIcon>
              <ListItemText>Fit to Screen</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Paper>
    )
  }

  // Desktop version
  return (
    <Paper sx={{ p: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {/* History Controls */}
        <ButtonGroup variant='contained' size='small'>
          <Tooltip title='Undo (Ctrl+Z)'>
            <span>
              <Button
                startIcon={<Undo />}
                onClick={() => dispatch(undo())}
                disabled={!canUndo}
              >
                Undo
              </Button>
            </span>
          </Tooltip>
          <Tooltip title='Redo (Ctrl+Y)'>
            <Button
              startIcon={<Redo />}
              onClick={() => dispatch(redo())}
              disabled={!canRedo}
            >
              Redo
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation='vertical' flexItem />

        {/* Object Controls */}
        <ButtonGroup variant='contained' size='small'>
          <Tooltip title='Delete (Del)'>
            <Button
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={!selectedObjectId}
            >
              Delete
            </Button>
          </Tooltip>
          <Tooltip title='Duplicate (Ctrl+D)'>
            <Button
              startIcon={<ContentCopyOutlined />}
              onClick={handleDuplicate}
              disabled={!selectedObjectId}
            >
              Duplicate
            </Button>
          </Tooltip>
          <Tooltip title='Copy (Ctrl+C)'>
            <Button
              startIcon={<ContentCopy />}
              onClick={handleCopy}
              disabled={!selectedObjectId}
            >
              Copy
            </Button>
          </Tooltip>
          <Tooltip title='Paste (Ctrl+V)'>
            <Button
              startIcon={<ContentPaste />}
              onClick={handlePaste}
              disabled={!clipboard}
            >
              Paste
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation='vertical' flexItem />

        {/* Layer Controls */}
        <ButtonGroup variant='contained' size='small'>
          <Tooltip title='Bring Forward (Ctrl+])'>
            <Button
              startIcon={<MoveUp />}
              onClick={handleBringForward}
              disabled={!selectedObjectId}
            >
              Forward
            </Button>
          </Tooltip>
          <Tooltip title='Send Backward (Ctrl+[)'>
            <Button
              startIcon={<MoveDown />}
              onClick={handleSendBackward}
              disabled={!selectedObjectId}
            >
              Backward
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation='vertical' flexItem />

        {/* Slide Controls */}
        <ButtonGroup variant='contained' size='small'>
          <Tooltip title='Add Slide'>
            <Button startIcon={<Add />} onClick={handleAddSlide}>
              Slide
            </Button>
          </Tooltip>
          <Tooltip title='Remove Slide'>
            <Button
              startIcon={<Remove />}
              onClick={handleRemoveSlide}
              disabled={currentSlideIndex === 0}
            >
              Slide
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation='vertical' flexItem />

        {/* Zoom Controls */}
        <ButtonGroup variant='contained' size='small'>
          <Tooltip title='Zoom In (Ctrl+Plus)'>
            <Button startIcon={<ZoomIn />} onClick={() => dispatch(zoomIn())}>
              Zoom In
            </Button>
          </Tooltip>
          <Tooltip title='Zoom Out (Ctrl+Minus)'>
            <Button startIcon={<ZoomOut />} onClick={() => dispatch(zoomOut())}>
              Zoom Out
            </Button>
          </Tooltip>
          <Tooltip title='Fit to Screen (Ctrl+0)'>
            <Button
              startIcon={<FitScreen />}
              onClick={() => dispatch(resetZoom())}
            >
              Fit
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>
    </Paper>
  )
}

export default Toolbar
