import { z } from 'zod';

// TYPES
export type IFormInput = {
  url: string;
};

// ENUMS
export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset',
}

// SCHEMAS
export const virusTotalSubmitSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
});

export const virusTotalAnalysisSchema = z.object({
  data: z.object({
    attributes: z.object({
      status: z.string(),
      stats: z.object({
        malicious: z.number(),
      }),
    }),
  }),
});

export type VirusTotalSubmit = z.infer<typeof virusTotalSubmitSchema>;
export type VirusTotalAnalysis = z.infer<typeof virusTotalAnalysisSchema>;
