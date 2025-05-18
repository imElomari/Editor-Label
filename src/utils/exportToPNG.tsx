import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export const exportToPNG = async (elementId: string): Promise<string> => {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Element not found')

  const canvas = await html2canvas(element)
  return canvas.toDataURL('image/png')
}

export const exportToPDF = async (elementId: string): Promise<void> => {
  const imgData = await exportToPNG(elementId)
  const pdf = new jsPDF()
  
  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save('design.pdf')
}