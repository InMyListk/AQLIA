import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import markdownPdf from 'markdown-pdf';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const convertMdToPdf = async (
  playlist_id: string,
  language_code: string
) => {
  const pdfFile = 'FormattedOutput.pdf';

  const pdfOutputPath = path.resolve(
    __dirname,
    `../OutputFiles/PDF/${pdfFile}`
  );
  const mdOutputPath = path.resolve(__dirname, `../OutputFiles/Markdown`);

  let fileIndices: { fileName: string; order: number }[] = [];

  try {
    // Read Markdown files and create an array of absolute file paths
    const markdownFiles = fs
      .readdirSync(mdOutputPath)
      .filter((file) => file.endsWith('.md')) // Ensure only Markdown files are included
      .map((file) => {
        const fileNameWithExt: string = path.parse(file).name;
        const orderNumber: number = Number(
          fileNameWithExt.slice(playlist_id.length)
        );
        fileIndices.push({
          fileName: file,
          order: orderNumber,
        });
        return path.resolve(mdOutputPath, file);
      });

    if (markdownFiles.length === 0) {
      console.log('No Markdown files found to process.');
      return;
    }

    // Sort the markdown files
    const sortedMarkdownFilesObj = fileIndices.sort((a, b) => {
      return a.order - b.order;
    });

    // Extract the sortedMarkdownFilesObj object and only take the name
    const sortedMarkdownFiles = sortedMarkdownFilesObj.map((file) =>
      path.resolve(mdOutputPath, file.fileName)
    );

    console.log('Markdown files to process:', sortedMarkdownFiles);

    // Create a new PDF document using pdf-lib
    const mergedPdf = await PDFDocument.create();

    for (const markdownFile of sortedMarkdownFiles) {
      // Convert each markdown file to PDF
      const tempPdfPath = path.resolve(mdOutputPath, 'temp.pdf');

      const markdownPdfTo = promisify(
        (
          markdownFile: string,
          tempPdfPath: string,
          callback: (() => void) | undefined
        ) => {
          markdownPdf(
            language_code === 'ar'
              ? {
                  cssPath: path.resolve(__dirname, '../OutputFiles/style.css'),
                }
              : {}
          )
            .from(markdownFile)
            .to(tempPdfPath, callback);
        }
      );

      await markdownPdfTo(markdownFile, tempPdfPath);
      // Read the converted PDF and append it to the merged PDF
      const tempPdfBytes = fs.readFileSync(tempPdfPath);
      const tempPdfDoc = await PDFDocument.load(tempPdfBytes);
      const copiedPages = await mergedPdf.copyPages(
        tempPdfDoc,
        tempPdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));

      // Optionally remove the temporary PDF file after use
      fs.unlinkSync(tempPdfPath);
    }

    // Write the merged PDF to the final output file
    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(pdfOutputPath, mergedPdfBytes);

    console.log('Created PDF:', pdfOutputPath);
  } catch (error) {
    console.error('Error during conversion:', error);
  }
};

// For testing
const PLAYLIST_ID: string = 'PLlrATfBNZ98eEGlhsZpuBnGe66RnymvJ6';

convertMdToPdf(PLAYLIST_ID, 'ar');
