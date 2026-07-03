import { type AnalysisResponse } from './api';

export function downloadPdfReport(data: AnalysisResponse, fileName: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the PDF report.');
    return;
  }

  const skillsCount = Object.values(data.skills).reduce((acc, curr) => acc + curr.length, 0);
  const sectionsCount = Object.values(data.sections_found).filter(Boolean).length;
  
  const skillCategoriesHtml = Object.entries(data.skills).map(([category, list]) => {
    if (list.length === 0) return '';
    return `
      <div style="margin-bottom: 12px; padding: 10px; background: #F9FAFB; border-radius: 8px;">
        <strong style="color: #4B5563; font-size: 11px; text-transform: uppercase;">${category}</strong>
        <div style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 6px;">
          ${list.map(s => `<span style="background: #EEF2F6; color: #1F2937; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold;">${s}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  const strengthsHtml = data.strengths.map(s => `
    <li style="margin-bottom: 8px; font-size: 11px; line-height: 1.5; color: #374151;">
      <span style="color: #10B981; margin-right: 6px; font-weight: bold;">✓</span>${s}
    </li>
  `).join('');

  const weaknessesHtml = data.weaknesses.map(w => `
    <li style="margin-bottom: 8px; font-size: 11px; line-height: 1.5; color: #374151;">
      <span style="color: #EF4444; margin-right: 6px; font-weight: bold;">✗</span>${w}
    </li>
  `).join('');

  const recHtml = data.recommendations.map(r => `
    <li style="margin-bottom: 8px; font-size: 11px; line-height: 1.5; color: #374151;">
      <span style="color: #8B5CF6; margin-right: 6px; font-weight: bold;">✦</span>${r}
    </li>
  `).join('');

  const projectHtml = data.project_suggestions.map(p => `
    <div style="margin-bottom: 12px; padding: 12px; border-left: 3px solid #8B5CF6; background: #F9FAFB;">
      <h5 style="margin: 0 0 4px 0; font-size: 11px; color: #1F2937;">${p.title}</h5>
      <p style="margin: 0; font-size: 10px; color: #6B7280; line-height: 1.4;">${p.desc}</p>
    </div>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ResumeIQ Consulting Report - ${fileName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          color: #1F2937;
          margin: 0;
          padding: 0;
          background: #FFFFFF;
        }
        .page {
          width: 210mm;
          height: 297mm;
          padding: 20mm;
          box-sizing: border-box;
          page-break-after: always;
          position: relative;
        }
        .cover {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }
        .title-large {
          font-size: 36px;
          font-weight: 800;
          line-height: 1.1;
          color: #111827;
        }
        .subtitle {
          font-size: 16px;
          color: #6B7280;
          margin-top: 12px;
        }
        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 6px solid #8B5CF6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: bold;
          color: #8B5CF6;
        }
        .section-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #8B5CF6;
          border-bottom: 2px solid #8B5CF6;
          padding-bottom: 6px;
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: bold;
        }
        .grid-2 {
          display: grid;
          grid-cols: 2;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .footer-note {
          position: absolute;
          bottom: 20mm;
          left: 20mm;
          right: 20mm;
          border-top: 1px solid #E5E7EB;
          padding-top: 8px;
          font-size: 9px;
          color: #9CA3AF;
          display: flex;
          justify-content: space-between;
        }
      </style>
    </head>
    <body>
      <!-- Page 1: Cover Page -->
      <div class="page cover">
        <div style="margin-top: 40mm;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <div style="width: 24px; height: 24px; background: linear-gradient(to right, #8B5CF6, #C4B5FD); border-radius: 6px;"></div>
            <span style="font-weight: bold; font-size: 18px; color: #111827;">ResumeIQ AI</span>
          </div>
          <div class="title-large">PREMIUM RESUME<br/>AUDIT & ANALYSIS</div>
          <div class="subtitle">A comprehensive Applicant Tracking System (ATS) alignment and competency verification report.</div>
          <div style="margin-top: 12px; font-size: 12px; color: #374151;">
            Target Document: <strong>${fileName}</strong>
          </div>
        </div>

        <div>
          <div style="margin-bottom: 10mm; display: flex; gap: 40px;">
            <div>
              <span style="font-size: 10px; color: #9CA3AF; text-transform: uppercase; font-weight: bold;">ATS Compatibility</span>
              <div class="score-circle" style="margin-top: 8px;">${data.ats_score}%</div>
            </div>
            <div>
              <span style="font-size: 10px; color: #9CA3AF; text-transform: uppercase; font-weight: bold;">Overall Quality</span>
              <div class="score-circle" style="margin-top: 8px; border-color: #C4B5FD; color: #C4B5FD;">${data.resume_score}%</div>
            </div>
          </div>
          <div class="footer-note" style="position: static; margin-top: 20px;">
            <span>Report Generated: ${new Date().toLocaleDateString()}</span>
            <span>ResumeIQ Auditor v2.0.0</span>
          </div>
        </div>
      </div>

      <!-- Page 2: Analytical Details -->
      <div class="page">
        <div class="header">
          <span style="font-size: 11px; font-weight: bold; color: #4B5563;">ResumeIQ Audit Report</span>
          <span style="font-size: 10px; color: #9CA3AF;">Page 2 of 3</span>
        </div>

        <div class="section-title">Parsed Skill Taxonomy</div>
        <p style="font-size: 11px; color: #4B5563; line-height: 1.5; margin-bottom: 16px;">
          The resume was scanned against a multi-layered classification dictionary of technical coordinates. Total unique keywords detected: <strong>${skillsCount}</strong> in <strong>${sectionsCount}</strong> sections.
        </p>
        
        ${skillCategoriesHtml}

        <div class="grid-2" style="margin-top: 24px;">
          <div>
            <div class="section-title" style="margin-top: 0;">Formatting Audits</div>
            <p style="font-size: 10px; color: #6B7280; margin-bottom: 8px;">Section presence indicators:</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              ${Object.entries(data.sections_found).map(([sec, found]) => `
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 6px 0; text-transform: capitalize; color: #374151;">${sec}</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: ${found ? '#10B981' : '#EF4444'};">
                    ${found ? 'PRESENT ✓' : 'MISSING ✗'}
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>
          <div>
            <div class="section-title" style="margin-top: 0;">Grammar Check</div>
            <p style="font-size: 10px; color: #6B7280; margin-bottom: 8px;">Formatting & writing style alerts:</p>
            <div style="font-size: 10px; line-height: 1.4; color: #374151;">
              ${data.grammar_issues.length === 0 
                ? '<div style="color: #10B981; font-weight: bold;">No major style or format violations found.</div>'
                : data.grammar_issues.slice(0, 4).map(issue => `
                    <div style="margin-bottom: 8px; padding: 6px; background: #FFF5F5; border-left: 2px solid #EF4444; border-radius: 4px;">
                      <strong>${issue.type} [${issue.severity.toUpperCase()}]:</strong> ${issue.message}
                    </div>
                  `).join('')
              }
            </div>
          </div>
        </div>

        <div class="footer-note">
          <span>Target File: ${fileName}</span>
          <span>ResumeIQ AI</span>
        </div>
      </div>

      <!-- Page 3: Strategic Recommendations -->
      <div class="page">
        <div class="header">
          <span style="font-size: 11px; font-weight: bold; color: #4B5563;">ResumeIQ Audit Report</span>
          <span style="font-size: 10px; color: #9CA3AF;">Page 3 of 3</span>
        </div>

        <div class="grid-2">
          <div>
            <div class="section-title" style="margin-top: 0;">Document Strengths</div>
            <ul style="margin: 0; padding-left: 16px;">
              ${strengthsHtml}
            </ul>
          </div>
          <div>
            <div class="section-title" style="margin-top: 0;">Identified Gaps</div>
            <ul style="margin: 0; padding-left: 16px;">
              ${weaknessesHtml}
            </ul>
          </div>
        </div>

        <div class="section-title">Strategic Action Plan</div>
        <ul style="margin: 0 0 20px 0; padding-left: 16px;">
          ${recHtml}
        </ul>

        <div class="section-title">Recommended AI Project Portfolios</div>
        ${projectHtml}

        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <p style="font-size: 11px; font-weight: bold; color: #1F2937; margin: 0;">Aleeya Fatima - BS Artificial Intelligence Student</p>
          <p style="font-size: 9px; color: #9CA3AF; margin: 4px 0 0 0;">Platform Designed for Advanced AI Recruitment Auditing</p>
        </div>

        <div class="footer-note">
          <span>Target File: ${fileName}</span>
          <span>ResumeIQ AI</span>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.close();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
