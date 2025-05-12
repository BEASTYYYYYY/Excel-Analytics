import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileUp, AlertTriangle } from 'lucide-react';
import { processExcelFile } from './utils/api';

const FileUpload = ({ file, uploadSuccess, error, onFileSelect, onUploadSuccess,  showNotification }) => 
{
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndProcessFile(selectedFile);
    };

    const validateAndProcessFile = (selectedFile) => {
        if (!selectedFile) return;

        const fileType = selectedFile.name.split('.').pop().toLowerCase();
        if (fileType !== 'xls' && fileType !== 'xlsx') {
            showNotification('error', "Please upload only Excel files (.xls or .xlsx)");
            return;
        }

        // Generate data preview
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length > 0) {
                    // Only show first 5 rows for preview
                    onFileSelect(selectedFile, jsonData.slice(0, 5));
                } else {
                    onFileSelect(selectedFile, null);
                    showNotification('error', "The Excel file doesn't contain any data.");
                }
            } catch (error) {
                console.error("Error reading file:", error);
                onFileSelect(selectedFile, null);
                showNotification('error', "Failed to read Excel file. The file might be corrupted.");
            }
        };
        reader.readAsBinaryString(selectedFile);

        // Process file for upload
        handleUpload(selectedFile);
    };

    const handleUpload = async (selectedFile) => {
        setIsUploading(true);
        try {
            const result = await processExcelFile(selectedFile);
            if (result.success) {
                onUploadSuccess(result.fileDetails);
            } else {
                showNotification('error', result.message || "Backend processing failed.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            const errorMessage = error.response?.data?.message || "File upload failed.";
            showNotification('error', errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndProcessFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    <FileUp className="mr-2 h-6 w-6 text-indigo-600" />
                    File Upload
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Supported: .xls, .xlsx
                </span>
            </div>

            <div
                className={`border-2 ${dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900' : 'border-dashed border-gray-300 dark:border-gray-600'} 
                ${uploadSuccess ? 'border-green-300 bg-green-50 dark:bg-green-900' : ''} 
                rounded-xl p-8 transition-all duration-200`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {file && !uploadSuccess ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse mb-4">
                            <FileUp className="h-8 w-8 text-indigo-600" />
                        </div>
                        <p className="text-lg font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                        <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                            <div className="bg-indigo-600 h-2 rounded-full animate-[upload_2s_ease-in-out]" style={{ width: isUploading ? '100%' : '0%' }} />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{isUploading ? 'Uploading...' : 'Processing...'}</p>

                        {/* Data Preview */}
                    </div>
                ) : uploadSuccess ? (
                    <div className="flex flex-col items-center text-green-600">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-4">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium">Upload Successful!</p>
                        <p className="text-sm mt-1">Your file has been processed and is ready for analysis.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mb-4">
                            <FileUp className="h-8 w-8 text-indigo-600" />
                        </div>
                        <p className="text-lg font-medium">Drag & Drop your Excel file here</p>
                        <p className="text-sm text-gray-500 mt-1">or</p>
                        <label className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors cursor-pointer">
                            Browse Files
                            <input type="file" className="hidden" accept=".xls,.xlsx" onChange={handleFileChange} />
                        </label>
                        {error && (
                            <div className={`mt-4 p-2 rounded-lg flex items-center ${error.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                {error.includes("success") ? (
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                )}
                                <span className="text-sm">{error}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileUpload;