import { HfInference } from '@huggingface/inference';
import { getAccessToken } from '$lib/utils';

const MAX_TITLE_CHAR_LENGHT = 32;


const setupHuggingFace = async () => {
    const token = await getAccessToken()
    return new HfInference(token);
}

const hf = await setupHuggingFace();

async function generateSummary(inputText: string) {
    
    const result = await hf.summarization({
        inputs: inputText,
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
