const express = require('express');
const handlebars = require('handlebars');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/generate-pdf', (req, res) => {
  const { latexTemplate, variables, assets } = req.body;

  if (!latexTemplate) {
    return res.status(400).json({ error: 'latexTemplate is required' });
  }

  // Generate a unique ID for this job to avoid collisions
  const jobId = crypto.randomBytes(16).toString('hex');
  const tempDir = path.join(os.tmpdir(), `latex_${jobId}`);
  
  fs.mkdirSync(tempDir, { recursive: true });

  const texFilePath = path.join(tempDir, 'document.tex');
  const pdfFilePath = path.join(tempDir, 'document.pdf');

  try {
    // Write assets if any
    if (assets && Array.isArray(assets)) {
      for (const asset of assets) {
        if (asset.filename && asset.content) {
          const assetPath = path.join(tempDir, asset.filename);
          fs.writeFileSync(assetPath, Buffer.from(asset.content, 'base64'));
        }
      }
    }

    // Compile Handlebars template
    const template = handlebars.compile(latexTemplate);
    const compiledLatex = template(variables || {});

    // Write the compiled LaTeX to the temp file
    fs.writeFileSync(texFilePath, compiledLatex);

    // Run pdflatex
    // -interaction=nonstopmode prevents it from halting for user input on errors
    // -output-directory ensures output goes to our temp folder
    const cmd = `pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFilePath}"`;
    
    exec(cmd, (error, stdout, stderr) => {
      // pdflatex returns an error code if there are LaTeX compilation warnings/errors, 
      // but it might still generate a PDF. So we check if the PDF exists first.
      
      if (fs.existsSync(pdfFilePath)) {
        if (req.body.password) {
          try {
            const protectedPdfPath = path.join(tempDir, 'protected.pdf');
            const { execSync } = require('child_process');
            execSync(`qpdf --encrypt "${req.body.password}" "${req.body.password}" 256 -- "${pdfFilePath}" "${protectedPdfPath}"`, { stdio: 'pipe' });
            
            const pdfBuffer = fs.readFileSync(protectedPdfPath);
            fs.rmSync(tempDir, { recursive: true, force: true });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
            return res.send(pdfBuffer);
          } catch (e) {
            console.error('QPDF Encryption Error:', e.message);
            fs.rmSync(tempDir, { recursive: true, force: true });
            return res.status(500).json({ 
              error: 'Failed to encrypt PDF. Is qpdf installed on the system?',
              details: e.message 
            });
          }
        } else {
          const pdfBuffer = fs.readFileSync(pdfFilePath);
          fs.rmSync(tempDir, { recursive: true, force: true });
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
          return res.send(pdfBuffer);
        }
      } else {
        // PDF was not generated, definitely an error
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.error('LaTeX Error:', stdout);
        return res.status(500).json({ 
          error: 'Failed to compile LaTeX', 
          details: stdout 
        });
      }
    });

  } catch (err) {
    // Clean up on unexpected errors
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`LaTeX PDF Microservice running on port ${PORT}`);
});
