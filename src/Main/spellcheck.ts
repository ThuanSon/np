import axios from 'axios';

export interface GrammarCheckPayload {
  earlyStopping: boolean;
  maxWordsPercentage: number;
  numBeams: number;
  sample: boolean;
  string: string;
  style: string;
  temperature: number;
  tone: string;
  topK: number;
  topP: number;
  wsId: string;
}

export interface GrammarCheckResponseData {
  message: string;
  conversation_id: number;
  sentence_corrections: any; // Adjust type if sentence_corrections can have a specific structure
  code: number;
}

export interface GrammarCheckResponse {
  success: boolean;
  code: number;
  message: string;
  data: GrammarCheckResponseData;
}

const url = 'https://cors-anywhere.herokuapp.com/https://api.zerogpt.com/api/transform/grammarCheck';

export const sendGrammarCheckRequest = async (payload: GrammarCheckPayload): Promise<GrammarCheckResponse> => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/1',
    'Origin': 'https://www.zerogpt.com',
    'Referer': 'https://www.zerogpt.com/'
  };

  try {
    const response = await axios.post(url, payload, { headers });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


// Example usage:
const payload: GrammarCheckPayload = {
  earlyStopping: true,
  maxWordsPercentage: 0.15,
  numBeams: 5,
  sample: true,
  string: 'the red new cars',
  style: 'text',
  temperature: 1,
  tone: 'standard',
  topK: 50,
  topP: 1,
  wsId: '9f2feec8-dd44-4af2-9e53-d8b546c165ab'
};

sendGrammarCheckRequest(payload)
  .then((data) => console.log(data)) // Logs the response data
  .catch((error) => console.error('Request failed', error)); // Logs any errors
