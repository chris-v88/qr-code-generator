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

export enum VirusScanStatus {
  COMPLETE = 'completed',
  QUEUE = 'queued',
  IN_PROGRESS = 'in-progress',
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
      status: z.enum(VirusScanStatus),
      stats: z.object({
        malicious: z.number().int().min(0),
      }),
    }),
  }),
});

export type VirusTotalSubmit = z.infer<typeof virusTotalSubmitSchema>;
export type VirusTotalAnalysis = z.infer<typeof virusTotalAnalysisSchema>;
