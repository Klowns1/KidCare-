"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, Share2, Trash2, Loader2, FileIcon, CheckCircle, Copy } from 'lucide-react';
import { deleteFile, getFile, insertFile, listFiles, type StoredFile } from '@/lib/local-db';

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') resolve(reader.result);
            else reject(new Error('อ่านไฟล์ไม่สำเร็จ'));
        };
        reader.onerror = () => reject(new Error('อ่านไฟล์ไม่สำเร็จ'));
        reader.readAsDataURL(file);
    });
}

export default function FileManagementPage() {
    const { user } = useGlobal();
    const [files, setFiles] = useState<StoredFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const loadFiles = useCallback(() => {
        if (!user?.id) return;
        setLoading(true);
        setError('');
        try {
            setFiles(listFiles(user.id));
        } catch (err) {
            setError('โหลดไฟล์ไม่สำเร็จ');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) loadFiles();
    }, [user, loadFiles]);

    const handleFileUpload = async (file: File) => {
        if (!user?.id) return;
        try {
            setUploading(true);
            setError('');
            if (file.size > 4 * 1024 * 1024) {
                throw new Error('ไฟล์ต้องไม่เกิน 4MB');
            }
            const data_url = await readFileAsDataUrl(file);
            insertFile({
                user_id: user.id,
                name: file.name,
                size: file.size,
                type: file.type || 'application/octet-stream',
                data_url,
            });
            loadFiles();
            setSuccess('อัปโหลดไฟล์สำเร็จ');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'อัปโหลดไฟล์ไม่สำเร็จ');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;
        handleFileUpload(fileList[0]);
        event.target.value = '';
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const dropped = Array.from(e.dataTransfer.files);
            if (dropped.length > 0) handleFileUpload(dropped[0]);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user]
    );

    const handleDownload = (filename: string) => {
        if (!user?.id) return;
        const file = getFile(user.id, filename);
        if (!file) {
            setError('ไม่พบไฟล์');
            return;
        }
        const a = document.createElement('a');
        a.href = file.data_url;
        a.download = file.name;
        a.click();
    };

    const handleShare = (filename: string) => {
        if (!user?.id) return;
        const file = getFile(user.id, filename);
        if (!file) {
            setError('ไม่พบไฟล์');
            return;
        }
        setShareUrl(file.data_url);
        setSelectedFile(filename);
    };

    const handleDelete = () => {
        if (!fileToDelete || !user?.id) return;
        try {
            deleteFile(user.id, fileToDelete);
            loadFiles();
            setSuccess('ลบไฟล์สำเร็จ');
        } catch (err) {
            setError('ลบไฟล์ไม่สำเร็จ');
            console.error(err);
        } finally {
            setShowDeleteDialog(false);
            setFileToDelete(null);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">จัดการไฟล์</h1>
                <p className="text-sm text-gray-500 mt-1">เก็บรูปและเอกสารไว้ในเครื่องนี้</p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <Card
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={isDragging ? 'border-primary-500 border-2 border-dashed' : ''}
            >
                <CardHeader>
                    <CardTitle>อัปโหลดไฟล์</CardTitle>
                    <CardDescription>ลากวาง หรือเลือกไฟล์ (ไม่เกิน 4MB)</CardDescription>
                </CardHeader>
                <CardContent>
                    <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                        ) : (
                            <Upload className="h-8 w-8 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">เลือกไฟล์</span>
                        <input type="file" className="hidden" onChange={handleInputChange} />
                    </label>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>ไฟล์ของฉัน</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : files.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">ยังไม่มีไฟล์</p>
                    ) : (
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between gap-3 p-3 border rounded-xl"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileIcon className="h-5 w-5 text-gray-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(file.id)}
                                            className="p-2 rounded-lg hover:bg-gray-100"
                                            title="ดาวน์โหลด"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleShare(file.id)}
                                            className="p-2 rounded-lg hover:bg-gray-100"
                                            title="แชร์"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFileToDelete(file.id);
                                                setShowDeleteDialog(true);
                                            }}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                            title="ลบ"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ลิงก์ไฟล์</DialogTitle>
                        <DialogDescription>คัดลอกลิงก์เพื่อเปิดดูไฟล์บนเครื่องนี้</DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <input
                            readOnly
                            value={shareUrl.slice(0, 80) + '...'}
                            className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        />
                        <button
                            type="button"
                            className="px-3 py-2 bg-primary-600 text-white rounded-lg"
                            onClick={async () => {
                                await navigator.clipboard.writeText(shareUrl);
                                setShowCopiedMessage(true);
                                setTimeout(() => setShowCopiedMessage(false), 1500);
                            }}
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                    {showCopiedMessage && <p className="text-sm text-green-600">คัดลอกแล้ว</p>}
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ลบไฟล์นี้?</AlertDialogTitle>
                        <AlertDialogDescription>การลบไม่สามารถกู้คืนได้</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>ลบ</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
