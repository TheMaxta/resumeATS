const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');
const fs = require('fs');
const OpenAiApi = require('./openAiApi'); // Adjust the path if necessary
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const upload = multer({ dest: 'uploads/' });
const openAiApi = new OpenAiApi(process.env.OPENAI_API_KEY); // Use API key from .env

app.use(cors());

app.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        // Ensure the file is a .docx file
        if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return res.status(400).send('Please upload a .docx file');
        }

        mammoth.extractRawText({ path: req.file.path })
            .then(async result => {
                let resumeText = result.value;

                // Job description from the request body
                let jobDescriptionText = req.body.jobDescription;

                // Call OpenAI API methods
                const resume_technologies = await openAiApi.findTechnologies(resumeText);
                const job_technologies = await openAiApi.findTechnologies(jobDescriptionText);
                const softSkills = await openAiApi.findSoftSkills(jobDescriptionText);
                const hardSkills = await openAiApi.findHardSkills(jobDescriptionText);
                const keywordsTable = await openAiApi.createKeywordsTable(jobDescriptionText);

                res.send({
                    resumeText,
                    jobDescriptionText,
                    technologies,
                    softSkills,
                    hardSkills,
                    keywordsTable
                });
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
