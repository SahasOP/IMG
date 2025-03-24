import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

type InternshipForMarksheet = {
  companyName: string
  role: string
  duration: string
  startDate: string
  endDate: string
  credits: number
  teacherName: string
  adminName: string
}

type StudentInfo = {
  name: string
  email: string
  id: string
}

export async function generateMarksheetPDF(
  student: StudentInfo,
  internships: InternshipForMarksheet[],
  totalCredits: number,
) {
  // Create a new PDF document
  const doc = new jsPDF()

  // Add university logo (placeholder)
  // In a real app, you would use your university logo
  // doc.addImage(logoBase64, 'PNG', 15, 10, 30, 30)

  // Add title
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("INTERNSHIP MARKSHEET", 105, 20, { align: "center" })

  // Add student information
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Student Name: ${student.name}`, 15, 40)
  doc.text(`Student ID: ${student.id}`, 15, 48)
  doc.text(`Email: ${student.email}`, 15, 56)
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 15, 64)

  // Add internship table
  const tableColumn = ["Company", "Role", "Duration", "Period", "Credits", "Approved By"]

  const tableRows = internships.map((internship) => [
    internship.companyName,
    internship.role,
    internship.duration,
    `${internship.startDate} to ${internship.endDate}`,
    internship.credits.toString(),
    `${internship.teacherName}, ${internship.adminName}`,
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  })

  // Add total credits
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFont("helvetica", "bold")
  doc.text(`Total Credits: ${totalCredits}`, 15, finalY)

  // Add signature fields
  doc.text("Signatures:", 15, finalY + 20)

  doc.setFont("helvetica", "normal")
  doc.text("_______________________", 15, finalY + 40)
  doc.text("Department Head", 15, finalY + 48)

  doc.text("_______________________", 105, finalY + 40)
  doc.text("Academic Registrar", 105, finalY + 48)

  // Add footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(
      "This is an official document of the university. Any alterations will render it invalid.",
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10)
  }

  return doc
}

