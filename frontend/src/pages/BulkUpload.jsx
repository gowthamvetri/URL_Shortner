import { useState, useRef } from 'react';
import { urlService } from '../services/url.service';
import { UploadCloud, AlertCircle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';

const BulkUpload = () => {
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
            } catch (e) {}
          }
          return payload;
        });

        try {
          const response = await urlService.bulkCreateUrls(payloads);
          setResults(response);
          if (response.successful > 0) {
            toast.success(`Successfully created ${response.successful} links!`);
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
  };

  return (
    <div className="space-y-8 relative">
      <div className="relative z-10 p-8 bg-[#2ecc71] rounded-xl border-2 border-black shadow-hard-lg overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>
        <img src="/bulk_upload_illustration.png" alt="Bulk Upload" className="relative z-10 w-24 h-24 object-contain hidden sm:block drop-shadow-md" />
        <div className="relative z-10 flex-1">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-black mb-2">Bulk Upload</h2>
          <p className="text-black/80 font-medium">Generate multiple short links at once by uploading a CSV file.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg overflow-hidden">
          <div className="flex flex-col space-y-1.5 p-6 border-b-2 border-black bg-accent/20">
            <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Upload CSV</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Select or drag & drop your file below.</p>
          </div>
          
          <div className="p-8 space-y-6">
            {error && (
              <div className="mb-4 p-4 rounded-xl border-2 border-destructive bg-destructive/15 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-destructive text-sm font-bold">{error}</p>
              </div>
            )}

            {!results ? (
              <div className="space-y-6">
                <p className="text-sm font-medium text-muted-foreground max-w-2xl">
                  The CSV file must include an <strong>originalUrl</strong> column. You can also include optional columns like <strong>customAlias</strong> and <strong>expiryDate</strong>.
                </p>
                
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-4 border-dashed border-black rounded-2xl p-12 text-center bg-accent/20 transition-all ${file ? 'bg-primary/10 border-primary' : 'hover:bg-accent/40 hover:shadow-hard cursor-pointer'}`}
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
                    <div className="flex flex-col items-center space-y-3">
                      <FileText className="h-16 w-16 text-primary" />
                      <p className="font-bold text-xl">{file.name}</p>
                      <p className="text-sm font-bold text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="mt-4 text-sm text-destructive font-bold hover:underline px-4 py-2 border-2 border-destructive rounded-full hover:bg-destructive/10 transition-colors"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <UploadCloud className="h-16 w-16 text-muted-foreground" />
                      <p className="font-bold text-xl">Click to upload or drag and drop</p>
                      <p className="text-sm font-bold text-muted-foreground">CSV files only (Max 100 rows)</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  {file && (
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={parseAndSubmit}
                    disabled={!file || loading}
                    className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-8 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? <img src="/Sandy Loading.svg" className="mr-2 h-5 w-5" alt="Loading..." /> : 'Process CSV'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-black rounded-2xl bg-accent/20">
                  <div className="text-center">
                    <h3 className="font-heading font-extrabold text-4xl mb-6">Upload Complete</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <div className="flex items-center text-primary font-bold text-xl bg-white px-6 py-3 border-2 border-black rounded-full shadow-hard">
                        <CheckCircle2 className="h-6 w-6 mr-2" />
                        {results.successful} Created
                      </div>
                      {results.failed > 0 && (
                        <div className="flex items-center text-destructive font-bold text-xl bg-white px-6 py-3 border-2 border-black rounded-full shadow-hard">
                          <AlertCircle className="h-6 w-6 mr-2" />
                          {results.failed} Failed
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {results.errors && results.errors.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-heading font-extrabold text-2xl">Failed Rows</h4>
                    <div className="max-h-96 overflow-y-auto border-2 border-black rounded-xl p-4 bg-destructive/5 space-y-3">
                      {results.errors.map((err, idx) => (
                        <div key={idx} className="p-4 bg-white border-2 border-destructive rounded-lg shadow-sm">
                          <p className="font-bold text-destructive mb-1">Row {err.index + 2}: {err.error}</p>
                          <p className="text-sm font-medium text-muted-foreground truncate">{err.originalUrl || 'Missing URL'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-6 border-t-2 border-black gap-4">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground"
                  >
                    Upload Another
                  </button>
                  <Link
                    to="/urls"
                    className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-8 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground"
                  >
                    View My Links
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
