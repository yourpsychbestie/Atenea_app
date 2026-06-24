import { jsPDF } from 'jspdf'
import { useToast } from './Toast'
import type { Session } from '../../lib/types'

export default function ExportPDFButton({ session, patient }: { session: Session; patient: { alias: string; emoji: string } }) {
  const { showToast } = useToast()

  function handleExport() {
    const doc = new jsPDF()
    doc.setFont('helvetica')
    doc.setFontSize(20)
    doc.text(`${patient.emoji} Sesión — ${patient.alias}`, 20, 30)
    doc.setFontSize(12)
    doc.text(`Fecha: ${session.date.slice(0, 10)}`, 20, 45)
    doc.text(`Duración: ${session.duration_min} min`, 20, 55)
    doc.text(`Mood: ${session.mood_score}/10`, 20, 65)
    doc.text(`Insight: ${session.insight_level}/5`, 20, 75)
    doc.setFontSize(14)
    doc.text('Resumen', 20, 95)
    doc.setFontSize(11)
    doc.text(doc.splitTextToSize(session.summary || '-', 170), 20, 105)

    if (session.field_notes) {
      doc.setFontSize(14)
      doc.text('Notas de campo', 20, 140)
      doc.setFontSize(11)
      doc.text(doc.splitTextToSize(session.field_notes, 170), 20, 150)
    }

    if (session.interventions) {
      doc.setFontSize(14)
      doc.text('Intervenciones', 20, 185)
      doc.setFontSize(11)
      doc.text(doc.splitTextToSize(session.interventions, 170), 20, 195)
    }

    if (session.homework) {
      doc.setFontSize(14)
      doc.text('Tareas', 20, 230)
      doc.setFontSize(11)
      doc.text(doc.splitTextToSize(session.homework, 170), 20, 240)
    }

    const safeAlias = patient.alias.replace(/[^a-zA-Z0-9]/g, '_')
    doc.save(`sesion_${safeAlias}_${session.date.slice(0, 10)}.pdf`)
    showToast('PDF descargado')
  }

  return (
    <button onClick={handleExport} className="btn-secondary text-xs">
      Exportar PDF
    </button>
  )
}
