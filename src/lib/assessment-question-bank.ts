export interface AssessmentQuestion {
  id: string;
  title: string;
  recommendation: string;
}

export const ASSESSMENT_QUESTION_BANK: Record<
  "ai_skills" | "coding" | "career",
  AssessmentQuestion[]
> = {
  ai_skills: [
    {
      id: "ai_tool_usage",
      title: "Using AI tools on real tasks",
      recommendation:
        "Choose one real task and complete it with an AI tool. Save your prompt, review the output, and document what you changed.",
    },
    {
      id: "prompt_quality",
      title: "Writing effective prompts",
      recommendation:
        "Practice writing prompts that include a clear goal, context, constraints, and the output format you need. Compare the results from two versions.",
    },
    {
      id: "fact_verification",
      title: "Verifying AI-generated information",
      recommendation:
        "Take three factual claims produced by an AI tool. Verify them using trustworthy sources and record any errors you discover.",
    },
    {
      id: "ai_safety",
      title: "Using AI safely",
      recommendation:
        "Review a sample AI workflow and identify sensitive information, privacy risks, and outputs that require human review.",
    },
    {
      id: "ai_workflow",
      title: "Building complete AI workflows",
      recommendation:
        "Complete a small project from planning to final review. Use AI where helpful, verify the output, and document your own contribution.",
    },
  ],
  coding: [
    {
      id: "problem_decomposition",
      title: "Breaking down programming problems",
      recommendation:
        "Solve one beginner coding problem by writing the inputs, expected output, and solution steps before writing code. Test your plan with a small example.",
    },
    {
      id: "programming_fundamentals",
      title: "Programming fundamentals",
      recommendation:
        "Build a small Java program that uses functions, loops, conditions, and input validation. Explain what each function does.",
    },
    {
      id: "data_structures_algorithms",
      title: "Data structures and algorithms",
      recommendation:
        "Solve two array or string problems using different approaches. Compare their time complexity and explain why one approach is more efficient.",
    },
    {
      id: "debugging_testing",
      title: "Debugging and testing",
      recommendation:
        "Take a program with a known bug, reproduce the problem, fix it, and test normal, empty, and unexpected inputs.",
    },
    {
      id: "project_implementation",
      title: "Building working projects",
      recommendation:
        "Build a small feature, commit your changes to Git, write a README explaining how to run it, and document one technical decision you made.",
    },
  ],
  career: [
    {
      id: "resume_quality",
      title: "Strengthening your resume",
      recommendation:
        "Rewrite your resume to one page. For each project, write a bullet that says what you built, which tools you used, and the result.",
    },
    {
      id: "project_evidence",
      title: "Building visible project proof",
      recommendation:
        "Put your two best projects on GitHub with a README, screenshots, and a live demo link so others can verify your work.",
    },
    {
      id: "professional_presence",
      title: "Improving your professional presence",
      recommendation:
        "Update your LinkedIn headline, summary, and featured projects so they clearly match the role you are targeting.",
    },
    {
      id: "communication",
      title: "Communicating your work clearly",
      recommendation:
        "Write and practise a 60-second explanation of your best project: the problem, your solution, and what you learned.",
    },
    {
      id: "target_role_alignment",
      title: "Clarifying your target role",
      recommendation:
        "Choose one role, read five job posts for it, and list the skills that appear in most of them. Compare that list with your own skills.",
    },
  ],
};