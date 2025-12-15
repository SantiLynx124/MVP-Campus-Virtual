/**
 * Script para crear el PDF de ejemplo manualmente
 * Ejecutar con: node scripts/createPDF.js
 */

const { createSamplePDF } = require('../utils/createSamplePDF');

console.log('📄 Creando PDF de ejemplo...');
createSamplePDF()
  .then((pdfPath) => {
    console.log(`✅ PDF creado exitosamente en: ${pdfPath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creando PDF:', error.message);
    process.exit(1);
  });

