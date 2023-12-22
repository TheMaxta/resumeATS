const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');
const fs = require('fs');
const OpenAiApi = require('./openAiApi');
const Resume = require('./Resume');
const JobDescription = require('./JobDescription');
const AnalysisComparator = require('./AnalysisComparator');
const TextPreprocessor = require('./TextPreprocessor');
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

        const result = await mammoth.extractRawText({ path: req.file.path });
        let resumeText = result.value;
        let jobDescriptionText = req.body.jobDescription;

        // Preprocess text
        resumeText = TextPreprocessor.preprocess(resumeText);
        jobDescriptionText = TextPreprocessor.preprocess(jobDescriptionText);

        // Create Resume & Job Descripton Objects
        let resume = new Resume(resumeText);
        let jobDescription = new JobDescription(jobDescriptionText);

        // Set properties using OpenAI API
        resume.technologies = await openAiApi.findTechnologies(resume.text);
        jobDescription.technologies = await openAiApi.findTechnologies(jobDescription.text);
        jobDescription.softSkills = await openAiApi.findSoftSkills(jobDescription.text);
        jobDescription.hardSkills = await openAiApi.findHardSkills(jobDescription.text);
        // For miscKeywords, define how to retrieve them

        // Instantiate AnalysisComparator
        let comparator = new AnalysisComparator(resume, jobDescription);

        // Perform comparisons
        let technologyMatchCount = comparator.compareTechnologies();
        let softSkillsMatchCount = comparator.compareSoftSkills();
        let uniqueTechnologiesInResume = comparator.getUniqueWords(resume.technologies, jobDescription.technologies);
        let uniqueTechnologiesInJobDescription = comparator.getUniqueWords(jobDescription.technologies, resume.technologies);

        // Send the results in the response
        res.send({
            resumeText: resume.text,
            jobDescriptionText: jobDescription.text,
            resumeTechnologies: resume.technologies,
            jobTechnologies: jobDescription.technologies,
            technologyMatchCount,
            softSkillsMatchCount,
            uniqueTechnologiesInResume,
            uniqueTechnologiesInJobDescription
            // Include other fields as necessary
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file');
    } finally {
        // Clean up: delete the uploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
