'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { tmsRepository } from '@/lib/services/tms-service';
import { FreightDocument, DocumentType } from '@/types/tms';

export function DocumentsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<FreightDocument | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Upload Form State
  const [docType, setDocType] = useState<DocumentType>('proof_of_delivery');
  const [targetShipmentNumber, setTargetShipmentNumber] = useState('TMS-1039');
  const [fileName, setFileName] = useState('Signed_Customer_POD_TMS1039.pdf');
  const [verificationNotes, setVerificationNotes] = useState('Customer receiver physical stamp and signature verified.');

  const documents = tmsRepository.getDocuments().filter((d) => {
    const matchesSearch =
      d.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.shipment_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || d.document_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    tmsRepository.uploadDocument({
      organisation_id: 'org-apex-001',
      shipment_number: targetShipmentNumber,
      document_type: docType,
      file_name: fileName,
      file_size_bytes: 384000,
      mime_type: 'application/pdf',
      storage_path: `shipment-documents/${targetShipmentNumber}/${fileName}`,
      public_url: `/simulated-docs/${fileName}`,
      verified: true,
      verification_notes: verificationNotes,
      uploaded_by: 'Amit Patel (Senior Dispatcher)',
    });

    setUploadModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Shipment Document Center
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Bucket: shipment-documents
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise document repository for E-Way Bills, Consignment Lorry Receipts (LR), and Proof of Delivery (POD).
          </p>
        </div>

        <Button
          onClick={() => setUploadModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search file name, shipment #..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="all">All Document Types ({documents.length})</option>
              <option value="proof_of_delivery">Proof of Delivery (POD)</option>
              <option value="eway_bill">E-Way Bills (GSTN)</option>
              <option value="lorry_receipt">Lorry Receipts (LR)</option>
              <option value="freight_invoice">Freight Invoices</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Shipment #</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date Stamped</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[220px]">{doc.file_name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-blue-600">
                        {doc.shipment_number || 'General'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {doc.document_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 font-mono">
                      {Math.round(doc.file_size_bytes / 1024)} KB
                    </TableCell>

                    <TableCell className="text-xs text-slate-700">
                      {doc.uploaded_by || 'Operations Team'}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>

                    <TableCell>
                      {doc.verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Audit Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Unverified</span>
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewDoc(doc)}
                          className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Document Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <form onSubmit={handleUploadSubmit}>
            <DialogHeader>
              <DialogTitle>Upload Logistics Document</DialogTitle>
              <DialogDescription>
                Attach signed proof of delivery, lorry receipts, or e-way bills to Supabase storage.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div className="space-y-1">
                <Label htmlFor="docType">Document Classification</Label>
                <select
                  id="docType"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full text-xs bg-white border border-slate-200 rounded p-2 text-slate-800"
                >
                  <option value="proof_of_delivery">Proof of Delivery (Signed POD / e-POD)</option>
                  <option value="eway_bill">E-Way Bill (Government GST Portal Export)</option>
                  <option value="lorry_receipt">Consignment Note / Lorry Receipt (LR)</option>
                  <option value="freight_invoice">Transporter Freight Invoice</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="shipmentNum">Associated Shipment Number</Label>
                <Input
                  id="shipmentNum"
                  value={targetShipmentNumber}
                  onChange={(e) => setTargetShipmentNumber(e.target.value)}
                  placeholder="e.g. TMS-1039"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes">Verification / Audit Notes</Label>
                <Input
                  id="notes"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Notes on stamp clarity, receiver signature..."
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Upload to Storage
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="font-mono text-base">{previewDoc.file_name}</DialogTitle>
                <Badge variant="outline">{previewDoc.document_type.toUpperCase()}</Badge>
              </div>
              <DialogDescription>
                Simulated verified document stored in private bucket <span className="font-mono font-semibold">shipment-documents</span>
              </DialogDescription>
            </DialogHeader>

            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 text-slate-800">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">APEX DISTRIBUTION INDIA PVT LTD</h4>
                  <p className="text-[11px] text-slate-500">CONSIGNMENT NOTE & TELEMATICS PROOF</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{previewDoc.shipment_number}</p>
                  <p className="text-[10px] text-slate-400">GST: 27AAACA1234F1Z8</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-700">
                <div>
                  <span className="font-bold text-slate-900 block">DOCUMENT AUDIT STATUS:</span>
                  <p className="text-emerald-700 font-bold">DIGITALLY VERIFIED</p>
                  <p className="text-slate-500 mt-1">{previewDoc.verification_notes}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block">STORAGE PATH:</span>
                  <p className="text-slate-600 truncate">{previewDoc.storage_path}</p>
                  <p className="text-slate-400 mt-1">Uploaded by: {previewDoc.uploaded_by}</p>
                </div>
              </div>

              <div className="p-4 rounded border-2 border-dashed border-slate-300 bg-white text-center text-slate-400 text-xs">
                [Simulated Official Stamp & Carrier E-Sign Received • No Live PII Included]
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
