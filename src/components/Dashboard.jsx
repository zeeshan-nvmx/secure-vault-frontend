// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import api from '../services/api'
import FileUploadModal from './files/FileUploadModal'
import CreateNoteModal from './files/CreateNoteModal'
import FileViewModal from './files/FileViewModal'
import PinModal from './common/PinModal'
import { formatFileSize, formatDate } from '../utils/helpers'

const Dashboard = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [pinModalOpen, setPinModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await api.getFiles()
      console.log('Loaded files:', response.data) // Debug log
      setFiles(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileClick = (file) => {
    console.log('File clicked:', file) // Debug log
    setSelectedFile(file)
    setPendingAction({ type: 'view', file })
    setPinModalOpen(true)
  }

  const handlePinSubmit = async (pin) => {
    if (pendingAction.type === 'view') {
      try {
        console.log('Pending action:', pendingAction) // Debug log
        // Use either _id or id property
        const fileId = pendingAction.file._id || pendingAction.file.id
        console.log('File ID:', fileId) // Debug log
        const response = await api.getFile(fileId, pin)
        setSelectedFile(response.data)
        setPinModalOpen(false)
        setViewModalOpen(true)
      } catch (err) {
        throw new Error('Invalid PIN')
      }
    }
  }

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await api.deleteFile(fileId)
        setFiles(files.filter((f) => (f._id || f.id) !== fileId))
        setViewModalOpen(false)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  const handleFileUploaded = (newFile) => {
    // Convert id to _id for consistency
    const fileWithId = { ...newFile, _id: newFile.id || newFile._id }
    setFiles([fileWithId, ...files])
    setUploadModalOpen(false)
  }

  const handleNoteCreated = (newNote) => {
    // Convert id to _id for consistency
    const noteWithId = { ...newNote, _id: newNote.id || newNote._id }
    setFiles([noteWithId, ...files])
    setNoteModalOpen(false)
  }

  const handleFileUpdated = (updatedFile) => {
    const fileId = updatedFile.id || updatedFile._id
    setFiles(
      files.map((f) => {
        const currentId = f._id || f.id
        return currentId === fileId ? { ...f, ...updatedFile, _id: currentId } : f
      })
    )
    setViewModalOpen(false)
  }

  const getFileIcon = (fileType) => {
    const icons = {
      env: '🔐',
      txt: '📝',
      json: '📄',
      other: '📎',
    }
    return icons[fileType] || icons.other
  }

  if (loading) {
    return (
      <div className='container' style={{ padding: '2rem', textAlign: 'center' }}>
        <div className='spinner' style={{ width: '2rem', height: '2rem' }}></div>
      </div>
    )
  }

  return (
    <div className='container' style={{ padding: '2rem' }}>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='card-title'>My Files</h1>
        <div className='flex gap-2'>
          <button className='btn btn-primary' onClick={() => setNoteModalOpen(true)}>
            Create Note
          </button>
          <button className='btn btn-primary' onClick={() => setUploadModalOpen(true)}>
            Upload File
          </button>
        </div>
      </div>

      {error && <div className='alert alert-error mb-4'>{error}</div>}

      {files.length === 0 ? (
        <div className='card'>
          <div className='card-content' style={{ textAlign: 'center', padding: '3rem' }}>
            <p className='text-muted-foreground mb-4'>No files uploaded yet</p>
            <button className='btn btn-primary' onClick={() => setUploadModalOpen(true)}>
              Upload your first file
            </button>
          </div>
        </div>
      ) : (
        <div className='file-grid'>
          {files.map((file) => (
            <div key={file._id || file.id} className='file-card' onClick={() => handleFileClick(file)}>
              <div className='file-card-header'>
                <span style={{ fontSize: '1.5rem' }}>{getFileIcon(file.fileType)}</span>
                <span className='file-type'>{file.fileType}</span>
              </div>
              <h3 className='file-name'>{file.filename}</h3>
              <div className='file-meta'>
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDate(file.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadModalOpen && <FileUploadModal onClose={() => setUploadModalOpen(false)} onFileUploaded={handleFileUploaded} />}

      {noteModalOpen && <CreateNoteModal onClose={() => setNoteModalOpen(false)} onNoteCreated={handleNoteCreated} />}

      {viewModalOpen && selectedFile && (
        <FileViewModal file={selectedFile} onClose={() => setViewModalOpen(false)} onDelete={handleDelete} onUpdate={handleFileUpdated} />
      )}

      {pinModalOpen && <PinModal onClose={() => setPinModalOpen(false)} onSubmit={handlePinSubmit} />}
    </div>
  )
}

export default Dashboard

// // src/components/Dashboard.jsx
// import React, { useState, useEffect } from 'react'
// import api from '../services/api'
// import FileUploadModal from './files/FileUploadModal'
// import CreateNoteModal from './files/CreateNoteModal'
// import FileViewModal from './files/FileViewModal'
// import PinModal from './common/PinModal'
// import { formatFileSize, formatDate } from '../utils/helpers'

// const Dashboard = () => {
//   const [files, setFiles] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [uploadModalOpen, setUploadModalOpen] = useState(false)
//   const [noteModalOpen, setNoteModalOpen] = useState(false)
//   const [viewModalOpen, setViewModalOpen] = useState(false)
//   const [pinModalOpen, setPinModalOpen] = useState(false)
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [pendingAction, setPendingAction] = useState(null)

//   useEffect(() => {
//     loadFiles()
//   }, [])

//   const loadFiles = async () => {
//     try {
//       setLoading(true)
//       const response = await api.getFiles()
//       setFiles(response.data)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFileClick = (file) => {
//     setSelectedFile(file)
//     setPendingAction({ type: 'view', file })
//     setPinModalOpen(true)
//   }

//   const handlePinSubmit = async (pin) => {
//     if (pendingAction.type === 'view') {
//       try {
//         const response = await api.getFile(pendingAction.file._id, pin)
//         setSelectedFile(response.data)
//         setPinModalOpen(false)
//         setViewModalOpen(true)
//       } catch (err) {
//         throw new Error('Invalid PIN')
//       }
//     }
//   }

//   const handleDelete = async (fileId) => {
//     if (window.confirm('Are you sure you want to delete this file?')) {
//       try {
//         await api.deleteFile(fileId)
//         setFiles(files.filter((f) => f._id !== fileId))
//         setViewModalOpen(false)
//       } catch (err) {
//         alert(err.message)
//       }
//     }
//   }

//   const handleFileUploaded = (newFile) => {
//     setFiles([newFile, ...files])
//     setUploadModalOpen(false)
//   }

//   const handleNoteCreated = (newNote) => {
//     setFiles([newNote, ...files])
//     setNoteModalOpen(false)
//   }

//   const handleFileUpdated = (updatedFile) => {
//     setFiles(files.map((f) => (f._id === updatedFile.id ? { ...f, ...updatedFile } : f)))
//     setViewModalOpen(false)
//   }

//   const getFileIcon = (fileType) => {
//     const icons = {
//       env: '🔐',
//       txt: '📝',
//       json: '📄',
//       other: '📎',
//     }
//     return icons[fileType] || icons.other
//   }

//   if (loading) {
//     return (
//       <div className='container' style={{ padding: '2rem', textAlign: 'center' }}>
//         <div className='spinner' style={{ width: '2rem', height: '2rem' }}></div>
//       </div>
//     )
//   }

//   return (
//     <div className='container' style={{ padding: '2rem' }}>
//       <div className='flex justify-between items-center mb-4'>
//         <h1 className='card-title'>My Files</h1>
//         <div className='flex gap-2'>
//           <button className='btn btn-primary' onClick={() => setNoteModalOpen(true)}>
//             Create Note
//           </button>
//           <button className='btn btn-primary' onClick={() => setUploadModalOpen(true)}>
//             Upload File
//           </button>
//         </div>
//       </div>

//       {error && <div className='alert alert-error mb-4'>{error}</div>}

//       {files.length === 0 ? (
//         <div className='card'>
//           <div className='card-content' style={{ textAlign: 'center', padding: '3rem' }}>
//             <p className='text-muted-foreground mb-4'>No files uploaded yet</p>
//             <button className='btn btn-primary' onClick={() => setUploadModalOpen(true)}>
//               Upload your first file
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className='file-grid'>
//           {files.map((file) => (
//             <div key={file._id} className='file-card' onClick={() => handleFileClick(file)}>
//               <div className='file-card-header'>
//                 <span style={{ fontSize: '1.5rem' }}>{getFileIcon(file.fileType)}</span>
//                 <span className='file-type'>{file.fileType}</span>
//               </div>
//               <h3 className='file-name'>{file.filename}</h3>
//               <div className='file-meta'>
//                 <span>{formatFileSize(file.size)}</span>
//                 <span>{formatDate(file.createdAt)}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {uploadModalOpen && <FileUploadModal onClose={() => setUploadModalOpen(false)} onFileUploaded={handleFileUploaded} />}

//       {noteModalOpen && <CreateNoteModal onClose={() => setNoteModalOpen(false)} onNoteCreated={handleNoteCreated} />}

//       {viewModalOpen && selectedFile && (
//         <FileViewModal file={selectedFile} onClose={() => setViewModalOpen(false)} onDelete={handleDelete} onUpdate={handleFileUpdated} />
//       )}

//       {pinModalOpen && <PinModal onClose={() => setPinModalOpen(false)} onSubmit={handlePinSubmit} />}
//     </div>
//   )
// }

// export default Dashboard
