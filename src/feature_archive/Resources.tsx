import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../AuthContext';
import { Resource } from '../types';
import { Download, Upload, Trash2, FileText, Plus, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

export function Resources() {
  const { user, profile } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(-1);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
      setResources(docs);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !user) return;

    try {
      const storageRef = ref(storage, `resources/${user.uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploadProgress(0);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          toast.error('Upload failed');
          setUploadProgress(-1);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          await addDoc(collection(db, 'resources'), {
            title,
            fileUrl: downloadURL,
            fileName: file.name,
            createdAt: serverTimestamp()
          });

          toast.success('Resource uploaded successfully');
          setFile(null);
          setTitle('');
          setIsUploading(false);
          setUploadProgress(-1);
        }
      );
    } catch (error) {
      console.error('Error in upload process:', error);
      toast.error('Failed to upload file');
      setUploadProgress(-1);
    }
  };

  const handleDelete = async (resource: Resource) => {
    if (!window.confirm(`Delete ${resource.title}?`)) return;
    try {
      // Best effort to parse the storage path and delete the file
      // Since we just have download URL, it might be tricky to get a ref from URL,
      // but Firebase `ref` can actually take a download URL!
      try {
        const fileRef = ref(storage, resource.fileUrl);
        await deleteObject(fileRef);
      } catch (err) {
        console.warn('Could not delete storage file or it was already deleted:', err);
      }
      
      await deleteDoc(doc(db, 'resources', resource.id));
      toast.success('Resource removed');
    } catch (error) {
      console.error('Failed to delete resource:', error);
      toast.error('Failed to remove resource');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Please log in to view resources</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Resources</h2>
          <p className="text-slate-500 mt-1">Download additional study materials and cheat sheets.</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsUploading(!isUploading);
                setFile(null);
                setTitle('');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              {isUploading ? <FolderOpen className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {isUploading ? 'Cancel Upload' : 'Upload File'}
            </button>
          </div>
        )}
      </header>

      <AnimatePresence>
        {isAdmin && isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl mb-8">
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Logic Games Cheat Sheet"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">File to Upload</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer w-full px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
                        <Upload className="h-5 w-5 text-blue-500" />
                        {file ? file.name : 'Select a PDF or Document'}
                        <input
                          type="file"
                          required
                          className="hidden"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {uploadProgress >= 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={uploadProgress >= 0}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Upload Resource
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No resources available</h3>
            <p className="text-slate-500 mt-2">Check back later for new study materials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2" title={resource.title}>
                    {resource.title}
                  </h4>
                  <p className="text-sm text-slate-500 truncate" title={resource.fileName}>
                    {resource.fileName || 'Unknown file'}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-2">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(resource)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-slate-200 hover:border-red-100"
                      title="Delete resource"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
