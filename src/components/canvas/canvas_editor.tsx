import { useEffect, useRef, useState } from 'react'
// import {
//   Canvas,
//   Object,
//   Textbox as TBox,
//   FabricImage,
//   Rect,
//   Ellipse,
//   Group,
//   Line
// } from 'fabric'
import * as fabric from 'fabric'
import Box from '@mui/material/Box'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateObject, removeObject } from '../../store/slices/document'
import { useTheme, useMediaQuery } from '@mui/material'

declare module 'fabric' {
  interface Object {
    id?: string
  }
}


const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentSlide = useAppSelector(
    state => state.document.document?.slides[state.document.currentSlideIndex]
  )
  const currentSlideIndex = useAppSelector(
    state => state.document.currentSlideIndex
  )
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Handle window resize and adjust canvas dimensions
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      const newWidth = Math.min(containerWidth, 1200)
      const newHeight = (newWidth * 3) / 4

      setDimensions({
        width: newWidth,
        height: Math.min(newHeight, containerHeight - 32)
      })

      //   if (fabricCanvasRef.current) {
      //     fabricCanvasRef.current.setDimensions({
      //       width: newWidth,
      //       height: newHeight
      //     })
      //     fabricCanvasRef.current.renderAll()
      //   }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return

    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#f5f5f5',
      preserveObjectStacking: true,
      enablePointerEvents: true,
      selection: true,
      selectionFullyContained: true
    })

    if (isMobile) {
      fabricCanvasRef.current.setZoom(0.8)
    }

    const handleObjectModified = e => {
      if (e.target) {
        const obj = e.target as fabric.Object & { id?: string }
        if (obj.id) {
          dispatch(
            updateObject({
              id: obj.id,
              updates: {
                position: { x: obj.left || 0, y: obj.top || 0 },
                size: { width: obj.width || 0, height: obj.height || 0 },
                rotation: obj.angle || 0
              }
            })
          )
        }
      }
    }

    const handleObjectRemoved = e => {
      if (e.target) {
        const obj = e.target as fabric.Object & { id?: string }
        if (obj.id) {
          dispatch(removeObject(obj.id))
        }
      }
    }

    fabricCanvasRef.current.on('object:modified', handleObjectModified)
    fabricCanvasRef.current.on('object:removed', handleObjectRemoved)

    return () => {
      fabricCanvasRef.current?.off('object:modified', handleObjectModified)
      fabricCanvasRef.current?.off('object:removed', handleObjectRemoved)
      fabricCanvasRef.current?.dispose()
    }
  }, [dispatch, dimensions, isMobile])

  // Load objects into canvas
  useEffect(() => {
    if (!fabricCanvasRef.current || !currentSlide) return

    const canvas = fabricCanvasRef.current
    // const existingObjects = canvas.getObjects()

    // Clear only if we have new objects to render
    if (currentSlide.objects.length > 0) {
      canvas.clear()
    } else {
      return
    }

    const loadPromises = currentSlide.objects.map(obj => {
      return new Promise<void>(resolve => {
        let fabricObj: fabric.Object | undefined

        console.log(`Rendering object type: ${obj.type}`)

        switch (obj.type) {
          case 'text':
            fabricObj = new fabric.Textbox(obj.text, {
              left: obj.position.x,
              top: obj.position.y,
              width: obj.size.width,
              height: obj.size.height,
              angle: obj.rotation || 0,
              fontFamily: obj.style.fontFamily,
              fontSize: isMobile
                ? obj.style.fontSize * 0.9
                : obj.style.fontSize,
              fontWeight: obj.style.fontWeight,
              textAlign: obj.style.textAlign,
              fill: obj.style.color,
              backgroundColor: obj.style.fill
            })
            break

          case 'image': {
            const loadImage = async () => {
              const img = await new Promise<fabric.Image>(() => {
                fabric.Image.fromURL(obj.src, {
                  crossOrigin: 'anonymous'
                })
              })

              img.set({
                left: obj.position.x,
                top: obj.position.y,
                scaleX: obj.size.width / (img.width || 1),
                scaleY: obj.size.height / (img.height || 1),
                angle: obj.rotation || 0
              });
              (img as fabric.Image & { id: string }).id = obj.id
              canvas.add(img)
            }

            return loadImage()
          }

          case 'rectangle':
            fabricObj = new fabric.Rect({
              left: obj.position.x,
              top: obj.position.y,
              width: obj.size.width,
              height: obj.size.height,
              angle: obj.rotation || 0,
              fill: obj.style.fill,
              stroke: obj.style.stroke,
              strokeWidth: obj.style.strokeWidth
            })
            break

          case 'ellipse':
            fabricObj = new fabric.Ellipse({
              left: obj.position.x,
              top: obj.position.y,
              rx: obj.size.width / 2,
              ry: obj.size.height / 2,
              angle: obj.rotation || 0,
              fill: obj.style.fill,
              stroke: obj.style.stroke,
              strokeWidth: obj.style.strokeWidth
            })
            break

          case 'line':
            fabricObj = new fabric.Line(
              [
                obj.position.x,
                obj.position.y,
                obj.position.x + obj.size.width,
                obj.position.y + obj.size.height
              ],
              {
                angle: obj.rotation || 0,
                stroke: obj.style.stroke,
                strokeWidth: obj.style.strokeWidth
              }
            )
            break

          case 'group':
            if (obj.children && obj.children.length > 0) {
              const groupItems: fabric.Object[] = []
              obj.children.forEach(child => {
                if (child.type === 'rectangle') {
                  groupItems.push(
                    new fabric.Rect({
                      left: child.position.x,
                      top: child.position.y,
                      width: child.size.width,
                      height: child.size.height,
                      fill: child.style.fill
                    })
                  )
                } else if (child.type === 'text') {
                  groupItems.push(
                    new fabric.Textbox(child.text, {
                      left: child.position.x,
                      top: child.position.y,
                      fontSize: isMobile
                        ? child.style.fontSize * 0.9
                        : child.style.fontSize,
                      fill: child.style.color
                    })
                  )
                }
              })
              fabricObj = new fabric.Group(groupItems, {
                left: obj.position.x,
                top: obj.position.y,
                angle: obj.rotation || 0
              })
            }
            break

          default:
            // console.warn(`Unsupported object type: ${obj.type}`)
            break
        }

        if (fabricObj) {
          fabricObj.id = obj.id
          canvas.add(fabricObj)
        }
        resolve()
      })
    })

    Promise.all(loadPromises).then(() => {
      canvas.renderAll()
      console.log('Canvas rendering complete')
    })
  }, [currentSlide, currentSlideIndex, isMobile])

  return (
    <Box
      ref={containerRef}
      bgcolor={'transparent'}
      sx={{
        border: '1px solid #ccc',
        borderRadius: 1,
        width: '100%',
        height: '100%',
        minHeight: '400px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '100%',
          touchAction: isMobile ? 'none' : 'auto'
        }}
      />
    </Box>
  )
}

export default CanvasEditor
