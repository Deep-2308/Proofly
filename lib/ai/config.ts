const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`WARNING: Missing required environment variable: ${key}`);
    return "dummy-key-for-build";
  }
  return value;
};

const getEnvStr = (key: string, fallback: string): string => process.env[key] || fallback;
const getEnvInt = (key: string, fallback: number): number => {
  const val = process.env[key];
  return val ? parseInt(val, 10) : fallback;
};
const getEnvBool = (key: string, fallback: boolean): boolean => {
  const val = process.env[key];
  return val ? val === "true" : fallback;
};

export const aiConfig = {
  get orchestrator() {
    return {
      primaryProvider: getEnvStr("PRIMARY_AI_PROVIDER", "gemini"),
      fallbackProvider: getEnvStr("FALLBACK_AI_PROVIDER", "groq"),
    };
  },
  get gemini() {
    return {
      apiKey: requireEnv("GOOGLE_GENAI_API_KEY"),
      timeoutMs: getEnvInt("GEMINI_TIMEOUT_MS", 20000),
      tasks: {
        "challenge-generation": {
          model: getEnvStr("GEMINI_GENERATION_MODEL", "gemini-2.5-pro"),
          thinking: getEnvBool("GEMINI_GENERATION_THINKING", true),
        },
        evaluation: {
          model: getEnvStr("GEMINI_EVALUATION_MODEL", "gemini-2.5-pro"),
          thinking: getEnvBool("GEMINI_EVALUATION_THINKING", false),
        },
        "project-analysis": {
          model: getEnvStr("GEMINI_PROJECT_ANALYSIS_MODEL", "gemini-2.5-flash"),
          thinking: getEnvBool("GEMINI_PROJECT_ANALYSIS_THINKING", false),
        },
        "interview-turn": {
          model: getEnvStr("GEMINI_INTERVIEW_TURN_MODEL", "gemini-2.5-flash"),
          thinking: getEnvBool("GEMINI_INTERVIEW_TURN_THINKING", false),
        },
        "interview-report": {
          model: getEnvStr("GEMINI_INTERVIEW_REPORT_MODEL", "gemini-2.5-flash"),
          thinking: getEnvBool("GEMINI_INTERVIEW_REPORT_THINKING", false),
        },
        "portfolio-generation": {
          model: getEnvStr("GEMINI_PORTFOLIO_MODEL", "gemini-2.5-pro"),
          thinking: getEnvBool("GEMINI_PORTFOLIO_THINKING", true),
        },
      },
      // Global Gemini settings
      temperature: getEnvInt("GEMINI_TEMPERATURE", 0.7),
      maxTokens: getEnvInt("GEMINI_MAX_TOKENS", 2048),
    };
  },
  get groq() {
    return {
      apiKey: requireEnv("GROQ_API_KEY"),
      timeoutMs: getEnvInt("GROQ_TIMEOUT_MS", 8000),
      model: getEnvStr("GROQ_MODEL", "llama-3.3-70b-versatile"),
      temperature: getEnvInt("GROQ_TEMPERATURE", 0.7),
      maxTokens: getEnvInt("GROQ_MAX_TOKENS", 2048),
    };
  },
} as const;


