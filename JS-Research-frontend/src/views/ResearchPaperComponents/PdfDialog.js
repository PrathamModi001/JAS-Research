import { Dialog, IconButton, Toolbar, AppBar, Typography } from '@mui/material'
import { useState, useEffect, useRef, useCallback } from 'react'
import { pdfjs } from 'react-pdf'
import PrintIcon from '@mui/icons-material/Print'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import debounce from 'lodash/debounce'
import { userRole } from 'src/shared/utility/helpers'
import { useSelector } from 'react-redux'
import { selectUser } from 'src/redux/reducers/authSlice'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PdfDialog = ({ open, handleClose, PDFURL }) => {
  const containerRef = useRef(null)

  const renderPdf = useCallback(
    debounce((pdfUrl, container) => {
      if (pdfUrl) {
        renderPdfWithoutText(pdfUrl, container)
      }
    }, 1000),
    []
  )

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (containerRef.current) {
          renderPdf(PDFURL, containerRef.current)
        }
      }, 0)
    }

    return () => {
      renderPdf.cancel()
    }
  }, [open, PDFURL, renderPdf])

  const user = useSelector(selectUser)

  async function renderPdfWithoutText(pdfUrl, container) {
    const loadingTask = pdfjs.getDocument(pdfUrl)

    try {
      const pdf = await loadingTask.promise

      container.innerHTML = ''

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale: 1.5 })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          textLayer: null
        }
        await page.render(renderContext).promise

        const pageWrapper = document.createElement('div')
        pageWrapper.style.display = 'flex'
        pageWrapper.style.flexDirection = 'column'
        pageWrapper.style.alignItems = 'center'
        pageWrapper.style.marginBottom = '20px'
        pageWrapper.style.textAlign = 'center'

        const pageNumberDiv = document.createElement('div')
        pageNumberDiv.textContent = `Page ${pageNumber}`
        pageNumberDiv.style.margin = '10px'
        pageWrapper.appendChild(pageNumberDiv)

        pageWrapper.appendChild(canvas)

        if (pageNumber < pdf.numPages) {
          const line = document.createElement('hr')
          line.style.width = '80%'
          pageWrapper.appendChild(line)
        }

        container.appendChild(pageWrapper)
      }
    } catch (error) {
      console.error('Error rendering PDF:', error)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = PDFURL
    link.download = 'document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth>
      <AppBar position='relative'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1, color: 'white' }}>
            PDF Viewer
          </Typography>
          {PDFURL && user.role === userRole?.Admin && (
            <>
              <IconButton color='inherit' onClick={handleDownload}>
                <DownloadIcon />
              </IconButton>
            </>
          )}
          <IconButton color='inherit' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          justifyContent: 'center'
        }}
        ref={containerRef}
      />
    </Dialog>
  )
}

export default PdfDialog
