import * as  mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

interface FileReaders {
    [key: string]: (file: File) => string | Promise<string>;
}

const BACKEND_URL: string = 'https://briefpulse-backend.onrender.com/'

const fileReaders: FileReaders = {
    'txt': extractTextFromTxt,
    'docx': extractTextFromDocx,
    'pdf': extractTextFromPdf,
};

export async function backendRequest(data: object, endpoint: string) {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10_000)
    };

    const response = await fetch(BACKEND_URL + endpoint, options);
    return response;
}

export async function readFileContent(file: File): Promise<string> {
    const extension = (file.name.split('.').pop()?.toLowerCase() || '');

    if (!fileReaders.hasOwnProperty(extension)) {
        throw new UnsupportedFileError(`Unsupported file extension: ${extension}`);
    }

    let content = '';

    try {
        content = await fileReaders[extension](file);
    } catch (error: unknown) {

        let msg = '';
        if (error instanceof Error) {
            msg = error.message;
        }
        throw new FileReadError(`Error reading ${extension} file: ${msg}`);
    }

    if (content === '') {
        throw new EmptyFileError(`${file.name} has no content`);
    }

    return content;
}

async function extractTextFromTxt(txtFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const result = event.target?.result as string;
            resolve(result);
        };

        reader.onerror = (event) => {
            reject(event.target?.error);
        };

        reader.readAsText(txtFile);
    });
}

async function extractTextFromDocx(docxFile: File): Promise<string> {
    const result = await mammoth.extractRawText({ arrayBuffer: await docxFile.arrayBuffer() });
    return result.value;
}

async function extractTextFromPdf(pdfFile: File): Promise<string> {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    const loadingTask = pdfjs.getDocument(URL.createObjectURL(pdfFile));
    const pdf: pdfjs.PDFDocumentProxy = await loadingTask.promise;

    const numPages: number = pdf.numPages;
    let text: string = '';

    for (let pageNumber: number = 1; pageNumber <= numPages; pageNumber++) {
        const page: pdfjs.PDFPageProxy = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        //@ts-ignore
        text += content.items.map(item => item.str).join(' ');
    }

    // loadingTask.destroy();
    return text;
}

export class UnsupportedFileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnsupportedFileError';
    }
}

export class FileReadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileReadError';
    }
}

export class EmptyFileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmptyFileError';
    }
}
