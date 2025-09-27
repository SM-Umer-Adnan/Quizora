import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

function DownloadDropdown({ quiz, input,  }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadPDF = () => {
    if (!quiz.length) return;
    const doc = new jsPDF();
    let y = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Quizora Quiz", pageWidth / 2, y, { align: "center" });

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Topic: ${input || "N/A"}`, 14, y);

    y += 10;
    quiz.forEach((q: any, idx: number) => {
      const questionText = `${idx + 1}. ${q.question}`;
      const splitQuestion = doc.splitTextToSize(questionText, pageWidth - 28);
      doc.text(splitQuestion, 14, y);
      y += splitQuestion.length * 6;

      q.options.forEach((opt: string, optIdx: number) => {
        doc.text(`   ${String.fromCharCode(65 + optIdx)}. ${opt}`, 14, y);
        y += 6;
      });
      y += 4;
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });

    doc.save(`quiz_${new Date().toISOString()}.pdf`);
    setOpen(false);
  };

  const downloadWord = async () => {
    if (!quiz.length) return;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun({ text: "Quizora Quiz", bold: true, size: 36 })] }),
            new Paragraph({ text: `Topic: ${input || "N/A"}`, spacing: { after: 200 } }),
            ...quiz.flatMap((q: any, idx: number) => [
              new Paragraph({ text: `${idx + 1}. ${q.question}`, spacing: { after: 100 } }),
              ...q.options.map(
                (opt: string, optIdx: number) =>
                  new Paragraph({ text: `   ${String.fromCharCode(65 + optIdx)}. ${opt}` })
              ),
              new Paragraph({ text: "" }),
            ]),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiz_${new Date().toISOString()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setOpen(false);
  };

  const downloadTXT = () => {
    if (!quiz.length) return;
    const text = quiz
      .map(
        (q: any, idx: number) =>
          `${idx + 1}. ${q.question}\n${q.options
            .map((opt: string, i: number) => `   ${String.fromCharCode(65 + i)}. ${opt}`)
            .join("\n")}\n`
      )
      .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiz_${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <Button
        className="h-12 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        style={{ background: "rgb(255 204 76/var(--tw-bg-opacity,1))", fontWeight: "700", color: "black" }}
        onClick={() => setOpen(!open)}
      >
        Download
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          ▼
        </motion.span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 overflow-hidden"
          >
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={downloadPDF}
            >
              PDF
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={downloadWord}
            >
              Word DOCX
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={downloadTXT}
            >
              TXT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DownloadDropdown;