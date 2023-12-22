class DocumentAnalysis {
    constructor(text) {
        this._text = text;
        this._technologies = '';
        this._softSkills = '';
        this._hardSkills = '';
        this._miscKeywords = '';
    }

    // Getters and Setters for each property
    get text() {
        return this._text;
    }

    get technologies() {
        return this._technologies;
    }

    set technologies(value) {
        this._technologies = value;
    }

    get softSkills() {
        return this._softSkills;
    }

    set softSkills(value) {
        this._softSkills = value;
    }

    get hardSkills() {
        return this._hardSkills;
    }

    set hardSkills(value) {
        this._hardSkills = value;
    }

    get miscKeywords() {
        return this._miscKeywords;
    }

    set miscKeywords(value) {
        this._miscKeywords = value;
    }
}
module.exports = DocumentAnalysis;
