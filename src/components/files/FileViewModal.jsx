// src/components/files/FileViewModal.jsx
import React, { useState } from 'react'
import api from '../../services/api'
import { formatFileSize, formatDate } from '../../utils/helpers'

const FileViewModal = ({ file, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    filename: file.filename,
    content: file.content,
    pin: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get the file ID consistently
  const fileId = file.id || file._id

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'pin') {
      if (/^\d*$/.test(value) && value.length <= 4) {
        setEditData({ ...editData, [name]: value })
      }
    } else {
      setEditData({ ...editData, [name]: value })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')

    try {
      const updates = {
        filename: editData.filename,
        content: editData.content,
        pin: editData.pin,
      }

      const response = await api.updateFile(fileId, updates)
      onUpdate({ ...response.data, _id: fileId })
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content)
    alert('Content copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([file.content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className='modal-header'>
          <div>
            <h2 className='modal-title'>{isEditing ? 'Edit File' : file.filename || 'Untitled'}</h2>
            {!isEditing && (
              <div className='file-meta mt-1'>
                <span>{file.fileType}</span>
                <span>•</span>
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span>{formatDate(file.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
        <div className='modal-content'>
          {error && <div className='alert alert-error mb-4'>{error}</div>}

          {isEditing ? (
            <>
              <div className='form-group'>
                <label htmlFor='filename' className='label'>
                  Filename
                </label>
                <input type='text' id='filename' name='filename' className='input' value={editData.filename} onChange={handleChange} required />
              </div>

              <div className='form-group'>
                <label htmlFor='content' className='label'>
                  Content
                </label>
                <textarea id='content' name='content' className='textarea' value={editData.content} onChange={handleChange} rows={15} required />
              </div>

              <div className='form-group'>
                <label htmlFor='pin' className='label'>
                  4-Digit PIN (required to save)
                </label>
                <input
                  type='password'
                  id='pin'
                  name='pin'
                  className='input'
                  value={editData.pin}
                  onChange={handleChange}
                  placeholder='Enter your PIN'
                  maxLength={4}
                  pattern='\d{4}'
                  required
                />
              </div>
            </>
          ) : (
            <pre
              style={{
                backgroundColor: 'var(--muted)',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                overflowX: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
              {file.content}
            </pre>
          )}
        </div>
        <div className='modal-footer'>
          {isEditing ? (
            <>
              <button className='btn btn-secondary' onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className='btn btn-primary' onClick={handleSave} disabled={loading || !editData.pin}>
                {loading ? <span className='spinner'></span> : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button className='btn btn-destructive' onClick={() => onDelete(fileId)}>
                Delete
              </button>
              <div className='flex gap-2'>
                <button className='btn btn-secondary' onClick={handleCopy}>
                  Copy
                </button>
                <button className='btn btn-secondary' onClick={handleDownload}>
                  Download
                </button>
                <button className='btn btn-primary' onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileViewModal

// // src/components/files/FileViewModal.jsx
// import React, { useState } from 'react'
// import api from '../../services/api'
// import { formatFileSize, formatDate } from '../../utils/helpers'

// const FileViewModal = ({ file, onClose, onDelete, onUpdate }) => {
//   const [isEditing, setIsEditing] = useState(false)
//   const [editData, setEditData] = useState({
//     filename: file.filename,
//     content: file.content,
//     pin: '',
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleChange = (e) => {
//     const { name, value } = e.target

//     if (name === 'pin') {
//       if (/^\d*$/.test(value) && value.length <= 4) {
//         setEditData({ ...editData, [name]: value })
//       }
//     } else {
//       setEditData({ ...editData, [name]: value })
//     }
//   }

//   const handleSave = async () => {
//     setLoading(true)
//     setError('')

//     try {
//       const updates = {
//         filename: editData.filename,
//         content: editData.content,
//         pin: editData.pin,
//       }

//       const response = await api.updateFile(file.id, updates)
//       onUpdate(response.data)
//       setIsEditing(false)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCopy = () => {
//     navigator.clipboard.writeText(file.content)
//     alert('Content copied to clipboard!')
//   }

//   const handleDownload = () => {
//     const blob = new Blob([file.content], { type: 'text/plain' })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = file.filename
//     document.body.appendChild(a)
//     a.click()
//     window.URL.revokeObjectURL(url)
//     document.body.removeChild(a)
//   }

//   return (
//     <div className='modal-overlay' onClick={onClose}>
//       <div className='modal' onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
//         <div className='modal-header'>
//           <div>
//             <h2 className='modal-title'>{isEditing ? 'Edit File' : file.filename}</h2>
//             {!isEditing && (
//               <div className='file-meta mt-1'>
//                 <span>{file.fileType}</span>
//                 <span>•</span>
//                 <span>{formatFileSize(file.size)}</span>
//                 <span>•</span>
//                 <span>{formatDate(file.createdAt)}</span>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className='modal-content'>
//           {error && <div className='alert alert-error mb-4'>{error}</div>}

//           {isEditing ? (
//             <>
//               <div className='form-group'>
//                 <label htmlFor='filename' className='label'>
//                   Filename
//                 </label>
//                 <input type='text' id='filename' name='filename' className='input' value={editData.filename} onChange={handleChange} required />
//               </div>

//               <div className='form-group'>
//                 <label htmlFor='content' className='label'>
//                   Content
//                 </label>
//                 <textarea id='content' name='content' className='textarea' value={editData.content} onChange={handleChange} rows={15} required />
//               </div>

//               <div className='form-group'>
//                 <label htmlFor='pin' className='label'>
//                   4-Digit PIN (required to save)
//                 </label>
//                 <input
//                   type='password'
//                   id='pin'
//                   name='pin'
//                   className='input'
//                   value={editData.pin}
//                   onChange={handleChange}
//                   placeholder='Enter your PIN'
//                   maxLength={4}
//                   pattern='\d{4}'
//                   required
//                 />
//               </div>
//             </>
//           ) : (
//             <pre
//               style={{
//                 backgroundColor: 'var(--muted)',
//                 padding: '1rem',
//                 borderRadius: 'var(--radius)',
//                 overflowX: 'auto',
//                 fontFamily: 'monospace',
//                 fontSize: '0.875rem',
//                 lineHeight: '1.5',
//                 maxHeight: '400px',
//                 overflowY: 'auto',
//               }}>
//               {file.content}
//             </pre>
//           )}
//         </div>
//         <div className='modal-footer'>
//           {isEditing ? (
//             <>
//               <button className='btn btn-secondary' onClick={() => setIsEditing(false)}>
//                 Cancel
//               </button>
//               <button className='btn btn-primary' onClick={handleSave} disabled={loading || !editData.pin}>
//                 {loading ? <span className='spinner'></span> : 'Save Changes'}
//               </button>
//             </>
//           ) : (
//             <>
//               <button className='btn btn-destructive' onClick={() => onDelete(file.id)}>
//                 Delete
//               </button>
//               <div className='flex gap-2'>
//                 <button className='btn btn-secondary' onClick={handleCopy}>
//                   Copy
//                 </button>
//                 <button className='btn btn-secondary' onClick={handleDownload}>
//                   Download
//                 </button>
//                 <button className='btn btn-primary' onClick={() => setIsEditing(true)}>
//                   Edit
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default FileViewModal
