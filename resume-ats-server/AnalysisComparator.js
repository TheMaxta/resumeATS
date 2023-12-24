class AnalysisComparator {
    constructor(resume, jobDescription) {
        this.resume = resume;
        this.jobDescription = jobDescription;
    }

    countMatchingKeywords(resumeKeywords, jobDescriptionKeywords) {
        const resumeWordsSet = new Set(resumeKeywords.split(' '));
        const jobDescriptionWordsSet = new Set(jobDescriptionKeywords.split(' '));
        let count = 0;

        resumeWordsSet.forEach(word => {
            if (jobDescriptionWordsSet.has(word)) {
                count++;
            }
        });

        return count;
    }
    countAllWords() {
        return this.countMatchingKeywords(this.resume.text, this.jobDescription.text);
    }

    compareTechnologies() {
        return this.countMatchingKeywords(this.resume.technologies, this.jobDescription.technologies);
    }

    compareSoftSkills() {
        return this.countMatchingKeywords(this.resume.softSkills, this.jobDescription.softSkills);
    }
    getCommonWords(firstKeywords, secondKeywords) {
        const firstSet = new Set(firstKeywords.split(' '));
        const secondSet = new Set(secondKeywords.split(' '));
        const commonWords = [];

        firstSet.forEach(word => {
            if (secondSet.has(word)) {
                commonWords.push(word);
            }
        });

        return commonWords;
    }

    getUniqueWords(firstKeywords, secondKeywords) {
        const firstSet = new Set(firstKeywords.split(' '));
        const secondSet = new Set(secondKeywords.split(' '));
        const uniqueWords = [];

        firstSet.forEach(word => {
            if (!secondSet.has(word)) {
                uniqueWords.push(word);
            }
        });

        return uniqueWords;
    }

    // You can add more methods for other types of comparisons
}
module.exports = AnalysisComparator;