import * as poppler from 'pdf-poppler'

export const convertPageToPGJ = async (outDir: string, pdfPath: string): Promise<void> => {
  console.log('PDF PATH', pdfPath)

  const pdfOptions = {
    format: 'jpeg',
    out_dir: outDir
  }

  await poppler.convert(pdfPath, pdfOptions)
}
