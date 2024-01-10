import { HfInference } from '@huggingface/inference';

const MAX_TITLE_CHAR_LENGHT = 32;

const getAccessToken = async () => {
    // const variableValue = process.env.VARIABLE_NAME;
    return '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';
}

const setupHuggingFace = async () => {
    const token = await getAccessToken()
    return new HfInference(token);
}

const hf = await setupHuggingFace();

async function generateSummary(inputText: string) {
    
    const result = await hf.summarization({
        // model: 'facebook/bart-large-cnn',
        inputs: inputText,
        parameters: {
            // max_length: 100,

            // min_length: 0,
            // max_length: 1024,
        },
    });
    return result.summary_text;
};

export async function summarizeText(inputText: string) {
    
    const summary = await generateSummary(inputText);
    const title = generateTitle(inputText, MAX_TITLE_CHAR_LENGHT);
    return {summary, title};
}

function generateTitle(text: string, maxTitleLength: number) {
    const words = text.split(' ');
    const titleParts = [];

    let currentLength = 0;
    for (const word of words) {
        if (currentLength + word.length + titleParts.length > maxTitleLength) {
            break;
        }

        titleParts.push(word);
        currentLength += word.length;
    }

    return titleParts.join(' ');
}
