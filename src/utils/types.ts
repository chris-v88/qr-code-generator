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

export const virusScanStatusSchema = z.union([
  z.literal('completed'),
  z.literal('queued'),
  z.literal('in-progress'),
]);

export type VirusScanStatus = z.infer<typeof virusScanStatusSchema>;

export const virusTotalAnalysisSchema = z.object({
  data: z.object({
    attributes: z.object({
      status: virusScanStatusSchema,
      stats: z.object({
        malicious: z.number().int().min(0),
      }),
    }),
  }),
});

export type VirusTotalSubmit = z.infer<typeof virusTotalSubmitSchema>;
export type VirusTotalAnalysis = z.infer<typeof virusTotalAnalysisSchema>;
