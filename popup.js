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
        // Include additional fields as necessary
    })
    .catch((error) => {
        console.error('Error:', error);
        resultsDiv.innerHTML = 'Error processing the request.';
    });
});
