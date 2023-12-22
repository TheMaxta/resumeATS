const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');
const fs = require('fs');
const OpenAiApi = require('./openAiApi'); // Adjust the path if necessary
const Resume = require('./Resume'); // Adjust the path to your Resume class file
const JobDescription = require('./JobDescription'); // Adjust the path to your JobDescription class file
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const openAiApi = new OpenAiApi(process.env.OPENAI_API_KEY);

app.use(cors());
app.use(express.json()); // Add this line to handle JSON body in requests

app.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return res.status(400).send('Please upload a .docx file');
        }

        mammoth.extractRawText({ path: req.file.path })
            .then(async result => {
                let resumeText = result.value;
                let jobDescriptionText = req.body.jobDescription;

                let resume = new Resume(resumeText);
                let jobDescription = new JobDescription(jobDescriptionText);

                resume.technologies = await openAiApi.findTechnologies(resume.text);
                jobDescription.technologies = await openAiApi.findTechnologies(jobDescription.text);
                jobDescription.softSkills = await openAiApi.findSoftSkills(jobDescription.text);
                jobDescription.hardSkills = await openAiApi.findHardSkills(jobDescription.text);
                // For miscKeywords, you need to define how to retrieve them

                res.send({
                    resumeText: resume.text,
                    jobDescriptionText: jobDescription.text,
                    resumeTechnologies: resume.technologies,
                    jobTechnologies: jobDescription.technologies,
                    softSkills: jobDescription.softSkills,
                    hardSkills: jobDescription.hardSkills
                    // Add miscKeywords if needed
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error processing the file');
            })
            .finally(() => {
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
