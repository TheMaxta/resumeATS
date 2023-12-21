document.getElementById('submit').addEventListener('click', function() {
    const fileInput = document.getElementById('resumeUpload');
    const jobDescription = document.getElementById('jobDescription').value;
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
        // Display results or further process the extracted text
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
