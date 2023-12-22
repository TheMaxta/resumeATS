class TextPreprocessor {
    // Removes XML/HTML tags from the text
    static removeXmlChars(text) {
        return text.replace(/<[^>]*>?/gm, '');
    }

    // Removes punctuation from the text
    static removePunctuation(text) {
        return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    }

    // Normalizes whitespace in the text
    static normalizeWhitespace(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    // Converts the text to lowercase
    static toLowercase(text) {
        return text.toLowerCase();
    }

    // Process the text through all steps
    static preprocess(text) {
        let processedText = TextPreprocessor.removeXmlChars(text);
        processedText = TextPreprocessor.removePunctuation(processedText);
        processedText = TextPreprocessor.normalizeWhitespace(processedText);
        processedText = TextPreprocessor.toLowercase(processedText);

        return processedText;
    }
}
module.exports = TextPreprocessor;