const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/upload', upload.single('resume'), (req, res) => {
    try {
        // Ensure the file is a .docx file
        if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return res.status(400).send('Please upload a .docx file');
        }

        mammoth.extractRawText({ path: req.file.path })
            .then(result => {
                let extractedText = result.value;

                // Job description from the request body
                let jobDescription = req.body.jobDescription;

                console.log(`Resume Received: ${extractedText}`);
                console.log(`Job Description Received: ${jobDescription}`);
                res.send({ text: extractedText, jobDescription: jobDescription });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error processing the file');
            })
            .finally(() => {
                // Clean up: delete the uploaded file
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
