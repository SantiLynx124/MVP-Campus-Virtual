/**
 * Utilidad para crear un PDF de ejemplo
 * Genera un PDF con ejercicios de SQL para pruebas
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Crear PDF de ejemplo con ejercicios de SQL
 * Retorna una Promise que se resuelve cuando el PDF está listo
 */
const createSamplePDF = () => {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    const pdfPath = path.join(uploadsDir, 'sql-ejercicios.pdf');

    // Crear directorio si no existe
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Si el PDF ya existe, no recrearlo
    if (fs.existsSync(pdfPath)) {
      return resolve(pdfPath);
    }

    // Crear nuevo documento PDF
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Crear stream de escritura
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Contenido del PDF
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text('Ejercicios de SQL', { align: 'center' })
       .moveDown(0.5);

    doc.fontSize(12)
       .font('Helvetica')
       .text('Curso: Base de Datos - CS302', { align: 'center' })
       .text('Universidad San Sebastián', { align: 'center' })
       .moveDown(1);

    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Ejercicio 1: Consultas Básicas', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11)
       .font('Helvetica')
       .text('1. Selecciona todos los registros de la tabla "estudiantes".')
       .moveDown(0.3)
       .text('   Respuesta: SELECT * FROM estudiantes;')
       .moveDown(0.5)
       .text('2. Selecciona solo el nombre y email de los estudiantes.')
       .moveDown(0.3)
       .text('   Respuesta: SELECT nombre, email FROM estudiantes;')
       .moveDown(1);

    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Ejercicio 2: Filtros WHERE', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11)
       .font('Helvetica')
       .text('1. Encuentra todos los estudiantes mayores de 20 años.')
       .moveDown(0.3)
       .text('   Respuesta: SELECT * FROM estudiantes WHERE edad > 20;')
       .moveDown(0.5)
       .text('2. Encuentra estudiantes cuyo nombre empiece con "J".')
       .moveDown(0.3)
       .text('   Respuesta: SELECT * FROM estudiantes WHERE nombre LIKE \'J%\';')
       .moveDown(1);

    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Ejercicio 3: JOINs', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11)
       .font('Helvetica')
       .text('1. Obtén el nombre del estudiante y el nombre del curso en el que está inscrito.')
       .moveDown(0.3)
       .text('   Respuesta:')
       .text('   SELECT e.nombre, c.nombre')
       .text('   FROM estudiantes e')
       .text('   INNER JOIN inscripciones i ON e.id = i.estudiante_id')
       .text('   INNER JOIN cursos c ON i.curso_id = c.id;')
       .moveDown(1);

    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Ejercicio 4: Agregaciones', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11)
       .font('Helvetica')
       .text('1. Cuenta cuántos estudiantes hay en total.')
       .moveDown(0.3)
       .text('   Respuesta: SELECT COUNT(*) FROM estudiantes;')
       .moveDown(0.5)
       .text('2. Calcula el promedio de edad de los estudiantes.')
       .moveDown(0.3)
       .text('   Respuesta: SELECT AVG(edad) FROM estudiantes;')
       .moveDown(1);

    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Ejercicio 5: Subconsultas', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11)
       .font('Helvetica')
       .text('1. Encuentra estudiantes que tienen una calificación mayor al promedio.')
       .moveDown(0.3)
       .text('   Respuesta:')
       .text('   SELECT * FROM estudiantes')
       .text('   WHERE calificacion > (SELECT AVG(calificacion) FROM estudiantes);')
       .moveDown(1);

    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Notas:', { underline: true })
       .moveDown(0.3);

    doc.fontSize(10)
       .font('Helvetica')
       .text('• Practica estos ejercicios en tu base de datos local.')
       .text('• Experimenta con diferentes variaciones de las consultas.')
       .text('• Consulta la documentación oficial de SQL para más información.')
       .moveDown(1);

    doc.fontSize(10)
       .font('Helvetica-Oblique')
       .text('Documento generado automáticamente para fines educativos.', { align: 'center' })
       .text('Universidad San Sebastián - 2024', { align: 'center' });

    // Finalizar el PDF y esperar a que termine
    doc.end();
    
    stream.on('finish', () => {
      resolve(pdfPath);
    });
    
    stream.on('error', (error) => {
      reject(error);
    });
  });
};

module.exports = { createSamplePDF };

