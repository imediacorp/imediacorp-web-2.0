/**
 * Chart Export Component
 * Provides functionality to export charts as PNG/PDF
 */

'use client';

import React, { useRef } from 'react';

interface ChartExportProps {
  chartId: string;
  chartTitle?: string;
  onExport?: (format: 'png' | 'pdf') => void;
}

export function ChartExport({ chartId, chartTitle, onExport }: ChartExportProps) {
  const exportChart = async (format: 'png' | 'pdf') => {
    if (onExport) {
      onExport(format);
      return;
    }

    // Default implementation using html2canvas (would need to be installed)
    try {
      const element = document.getElementById(chartId);
      if (!element) {
        console.error('Chart element not found');
        return;
      }

      if (format === 'png') {
        // For PNG, we'd use html2canvas
        // const canvas = await html2canvas(element);
        // const url = canvas.toDataURL('image/png');
        // const link = document.createElement('a');
        // link.download = `${chartTitle || 'chart'}.png`;
        // link.href = url;
        // link.click();
        console.log('PNG export not implemented - requires html2canvas');
      } else if (format === 'pdf') {
        // For PDF, we'd use jsPDF
        // const canvas = await html2canvas(element);
        // const imgData = canvas.toDataURL('image/png');
        // const pdf = new jsPDF();
        // pdf.addImage(imgData, 'PNG', 0, 0);
        // pdf.save(`${chartTitle || 'chart'}.pdf`);
        console.log('PDF export not implemented - requires jsPDF');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => exportChart('png')}
        className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        📥 Export PNG
      </button>
      <button
        onClick={() => exportChart('pdf')}
        className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        📥 Export PDF
      </button>
    </div>
  );
}

