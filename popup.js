document.getElementById('submit').addEventListener('click', function() {
    const fileInput = document.getElementById('resumeUpload');
    const jobDescription = document.getElementById('jobDescription').value;
    const resultsDiv = document.getElementById('results');
    const formData = new FormData();

    formData.append('resume', fileInput.files[0]);
    formData.append('jobDescription', jobDescription);

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);

        resultsDiv.innerHTML = '<h2>Analysis Results</h2>';

        if(data.resumeTechnologies) {
            resultsDiv.innerHTML += `<p><strong>Technologies found in your Resume:</strong> ${data.resumeTechnologies}</p>`;
        }
        if(data.jobTechnologies) {
            resultsDiv.innerHTML += `<p><strong>Technologies from Job Description:</strong> ${data.jobTechnologies}</p>`;
        }
        if(data.softSkills) {
            resultsDiv.innerHTML += `<p><strong>Soft Skills from Job:</strong> ${data.softSkills}</p>`;
        }
        if(data.hardSkills) {
            resultsDiv.innerHTML += `<p><strong>Hard Skills from Job:</strong> ${data.hardSkills}</p>`;
        }
        if(data.technologyMatchCount) {
            resultsDiv.innerHTML += `<p><strong>Number of Matching Technologies:</strong> ${data.technologyMatchCount}</p>`;
        }
        if(data.softSkillsMatchCount) {
            resultsDiv.innerHTML += `<p><strong>Number of Matching Soft Skills:</strong> ${data.softSkillsMatchCount}</p>`;
        }
        if (data.commonWordsInBoth){
            resultsDiv.innerHTML += `<p><strong>These are the words in both:</strong>${data.commonWordsInBoth}</p>`
        }
        if(data.uniqueTechnologiesInResume) {
            resultsDiv.innerHTML += `<p><strong>Unique Technologies in Resume:</strong> ${data.uniqueTechnologiesInResume.join(', ')}</p>`;
        }
        if(data.uniqueTechnologiesInJobDescription) {
            resultsDiv.innerHTML += `<p><strong>Unique Technologies in Job Description:</strong> ${data.uniqueTechnologiesInJobDescription.join(', ')}</p>`;
        }
        //NON AI
        if(data.nonAiallWords) {
            resultsDiv.innerHTML += `<p><strong>NONE AI SECTION STARTS HERE:Unique Technologies in Job Description:</strong> ${data.nonAiallWords}</p>`;
        }
        if(data.nonAiCommonWords) {
            resultsDiv.innerHTML += `<p><strong>Unique Technologies in Job Description:</strong> ${data.nonAiCommonWords.join(', ')}</p>`;
        }
        if(data.nonAiUniqueResume) {
            resultsDiv.innerHTML += `<p><strong>Unique Technologies in Job Description:</strong> ${data.nonAiUniqueResume.join(', ')}</p>`;
        }
        if(data.nonAiUniqueTech) {
            resultsDiv.innerHTML += `<p><strong>Unique Technologies in Job Description:</strong> ${data.nonAiUniqueTech.join(', ')}</p>`;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        resultsDiv.innerHTML = 'Error processing the request.';
    });
});
