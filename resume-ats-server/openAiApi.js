const { default: OpenAI } = require('openai');

class OpenAiApi {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
    }

    async findTechnologies(text) {
        const prompt = `Identify all technology-related keywords from the following text:\n\n${text}`;
        return this.chatCompletion(prompt);
    }

    async findSoftSkills(text) {
        const prompt = `Identify all soft skills mentioned in the following text:\n\n${text}`;
        return this.chatCompletion(prompt);
    }

    async findHardSkills(text) {
        const prompt = `Identify all hard skills or technical skills mentioned in the following text:\n\n${text}`;
        return this.chatCompletion(prompt);
    }

    async createKeywordsTable(text) {
        const prompt = `Create a table categorizing required skills, bonus skills, and on-the-job skills based on the following job description:\n\n${text}`;
        return this.chatCompletion(prompt);
    }

    async chatCompletion(inputString, modelVersion = 'gpt-3.5-turbo') {
        console.log(`Making chat completion API call`);
        const chatResponse = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: inputString }],
            model: modelVersion
        });
    
        return chatResponse.choices[0].message.content;
    }
}
module.exports = OpenAiApi;
