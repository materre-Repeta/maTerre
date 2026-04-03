package com.materre.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.materre.model.VerificationReport;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfGeneratorService {

    public byte[] generateVerificationReport(VerificationReport report) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header - maTerre Branding
            document.add(new Paragraph("maTerre - L'Arbitre du Foncier")
                    .setFontColor(new DeviceRgb(46, 125, 50)) // mt-green
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("RAPPORT D'ARBITRAGE NOTARIAL (EXPRESS 48H)")
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Summary Table
            float[] columnWidths = {1, 3};
            Table table = new Table(UnitValue.createPercentArray(columnWidths)).useAllAvailableWidth();

            table.addCell(new Cell().add(new Paragraph("Numéro de Titre")).setBold());
            table.addCell(new Cell().add(new Paragraph(report.getRequest().getTitleNumber())));

            table.addCell(new Cell().add(new Paragraph("Verdict")).setBold());
            Paragraph verdictPara = new Paragraph(report.getVerdict().toString());
            if (report.getVerdict().toString().equals("GREEN")) {
                verdictPara.setFontColor(ColorConstants.GREEN).setBold();
            } else if (report.getVerdict().toString().equals("RED")) {
                verdictPara.setFontColor(ColorConstants.RED).setBold();
            }
            table.addCell(new Cell().add(verdictPara));

            table.addCell(new Cell().add(new Paragraph("Notaire")).setBold());
            table.addCell(new Cell().add(new Paragraph(report.getNotary().getFullName())));

            document.add(table.setMarginBottom(20));

            // Report Details
            document.add(new Paragraph("Historique et Propriété").setBold().setFontSize(14));
            document.add(new Paragraph(report.getHistoricalSummary() != null ? report.getHistoricalSummary() : "N/A"));

            document.add(new Paragraph("Litiges et Contentieux").setBold().setFontSize(14).setMarginTop(10));
            document.add(new Paragraph(report.getDisputesLitiges() != null ? report.getDisputesLitiges() : "Aucun litige identifié."));

            document.add(new Paragraph("Charges et Hypothèques").setBold().setFontSize(14).setMarginTop(10));
            document.add(new Paragraph(report.getLiensHypotheques() != null ? report.getLiensHypotheques() : "Libre de toute charge."));

            // Footer
            document.add(new Paragraph("\n\nCe document est une certification numérique maTerre.")
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(50));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }
}
