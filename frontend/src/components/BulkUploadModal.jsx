import { useState, useRef } from 'react';
import { Modal } from './ui/Modal';
import { urlService } from '../services/url.service';
import { Loader2, UploadCloud, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

export const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setResults(null);
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setError('');
    setResults(null);
    if (droppedFile) {
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        setError('Please drop a valid CSV file.');
        return;
      }
      setFile(droppedFile);
    }
  };

  const parseAndSubmit = () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parseResult) => {
        const rows = parseResult.data;
        
        if (rows.length === 0) {
          setError('The CSV file is empty.');
          setLoading(false);
          return;
        }

        if (rows.length > 100) {
          setError('Maximum of 100 URLs allowed per batch.');
          setLoading(false);
          return;
        }

        // Validate headers roughly
        const headers = parseResult.meta.fields || [];
        if (!headers.includes('originalUrl')) {
          setError('CSV must contain an "originalUrl" column.');
          setLoading(false);
          return;
        }

        const payloads = rows.map((row) => {
          const payload = { originalUrl: row.originalUrl };
          if (row.customAlias && row.customAlias.trim() !== '') {
            payload.customAlias = row.customAlias.trim();
          }
          if (row.expiryDate && row.expiryDate.trim() !== '') {
            try {
              payload.expiryDate = new Date(row.expiryDate.trim()).toISOString();
            } catch (e) {
              // Ignore invalid dates, API will catch it or we default to null
            }
          }
          return payload;
        });

        try {
          const response = await urlService.bulkCreateUrls(payloads);
          setResults(response);
          if (response.successful > 0) {
            toast.success(`Successfully created ${response.successful} links!`);
            onSuccess(); // Refresh the list
          }
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to process bulk upload.');
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setLoading(false);
      }
    });
  };

  const resetAndClose = () => {
    setFile(null);
    setResults(null);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Bulk Upload CSV">
      {error && (
        <div className="mb-4 p-4 rounded-xl border-2 border-destructive bg-destructive/15 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-destructive text-sm font-bold">{error}</p>
        </div>
      )}

      {!results ? (
        <div className="space-y-6">
          <p className="text-sm font-medium text-muted-foreground">
            Upload a CSV file to generate multiple short links at once. The file must include an <strong>originalUrl</strong> column. Optional columns: <strong>customAlias</strong>, <strong>expiryDate</strong>.
          </p>
          
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed border-black rounded-xl p-8 text-center bg-accent/20 transition-all ${file ? 'bg-primary/10 border-primary' : 'hover:bg-accent/40 hover:shadow-hard cursor-pointer'}`}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex flex-col items-center space-y-2">
                <FileText className="h-10 w-10 text-primary" />
                <p className="font-bold">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="mt-2 text-sm text-destructive font-bold hover:underline"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <p className="font-bold">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">CSV files only (Max 100 rows)</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-black">
            <button
              type="button"
              onClick={resetAndClose}
              className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={parseAndSubmit}
              disabled={!file || loading}
              className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Process CSV'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-center p-6 border-2 border-black rounded-xl bg-accent/20">
            <div className="text-center">
              <h3 className="font-heading font-extrabold text-3xl mb-2">Upload Complete</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center text-primary font-bold">
                  <CheckCircle2 className="h-5 w-5 mr-1" />
                  {results.successful} Created
                </div>
                {results.failed > 0 && (
                  <div className="flex items-center text-destructive font-bold">
                    <AlertCircle className="h-5 w-5 mr-1" />
                    {results.failed} Failed
                  </div>
                )}
              </div>
            </div>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm">Failed Rows:</h4>
              <div className="max-h-48 overflow-y-auto border-2 border-black rounded-xl p-2 bg-destructive/5 space-y-2">
                {results.errors.map((err, idx) => (
                  <div key={idx} className="p-3 bg-white border-2 border-destructive rounded-lg text-sm">
                    <p className="font-bold text-destructive">Row {err.index + 2}: {err.error}</p>
                    <p className="text-muted-foreground truncate">{err.originalUrl || 'Missing URL'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t-2 border-black">
            <button
              type="button"
              onClick={resetAndClose}
              className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
