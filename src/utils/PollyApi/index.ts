// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { PollyClient, SynthesizeSpeechCommand, SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly';

import { getAmplifyRegion, getCredentials } from '@/utils/Sdk';

// Use the same region as the Amplify-created S3 bucket
async function getPollyClient() {
    return new PollyClient({
        region: getAmplifyRegion(),
        credentials: await getCredentials(),
    });
}

export type PollyPhrase = {
    voiceId: 'Salli' | 'Kimberly' | 'Kendra' | 'Joanna' | 'Ruth' | 'Ivy' | 'Joey' | 'Stephen' | 'Kevin' | 'Justin';
    text: string;
};

type GetAudioFromPollyProps = PollyPhrase;

/**
 * @description Return an unsigned array Blob from Polly
 * @param {PollyPhrase} voiceId - VoiceId to use for Polly
 * @param {string} text - Text to use for Polly
 */
export async function getAudioBlobFromPolly({ voiceId, text }: GetAudioFromPollyProps) {
    const pollyClient = await getPollyClient();
    const pollySynthesizeSpeechInput: SynthesizeSpeechCommandInput = {
        Engine: 'neural',
        LanguageCode: 'pt-BR', // original was en-US
        OutputFormat: 'mp3',
        SampleRate: '16000',
        Text: text,
        TextType: 'text',
        VoiceId: voiceId,
    };
    const pollySynthesizeSpeechCmd = new SynthesizeSpeechCommand(pollySynthesizeSpeechInput);
    const pollySynthesizeSpeechRsp = await pollyClient.send(pollySynthesizeSpeechCmd);
    const pollyByteArray = await pollySynthesizeSpeechRsp.AudioStream?.transformToByteArray();
    return new Blob([pollyByteArray as Uint8Array]);
}
