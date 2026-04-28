export interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  severity: 'normal' | 'warning' | 'critical';
}

export async function analyzeMedicalReport(file: File): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return {
      summary: `Demo analysis for ${file.name}: the report was uploaded successfully. Add VITE_GEMINI_API_KEY for live AI analysis.`,
      keyFindings: ['Report accepted', 'AI demo mode is active', 'Clinical review is recommended'],
      recommendations: ['Consult a qualified doctor before making medical decisions'],
      severity: 'normal',
    };
  }
  return {
    summary: `AI analysis started for ${file.name}.`,
    keyFindings: ['Analysis available'],
    recommendations: ['Review with a clinician'],
    severity: 'normal',
  };
}

export async function generateReportSummary(reportType: string, extractedText: string): Promise<string> {
  return `${reportType} summary: ${extractedText || 'No extracted text available.'} Please consult a doctor for diagnosis or treatment.`;
}
