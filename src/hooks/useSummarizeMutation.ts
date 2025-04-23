// src/hooks/useSummarizeMutation.ts
import { useMutation } from '@tanstack/react-query';
type SummarizeResponse = {
    summary: string;
};

type SummarizeInput = {
    content: string;
};

const callSummarizeApi = async (input: SummarizeInput): Promise<SummarizeResponse> => {
    const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
};

export const useSummarizeMutation = () => {
    return useMutation<SummarizeResponse, Error, SummarizeInput>({
        mutationFn: callSummarizeApi,
    });
};