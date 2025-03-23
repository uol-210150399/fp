import { type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { TextQuestion } from "./components/questions/text-question"
import { NumberQuestion } from "./components/questions/number-question"
import { ChoiceQuestion } from "./components/questions/choice-question"
import { RatingQuestion } from "./components/questions/rating-question"
import { RankingQuestion } from "./components/questions/ranking-question"
import { MatrixQuestion } from "./components/questions/matrix-question"
import { useState } from "react"

export function clientLoader({ params }: LoaderFunctionArgs) {
  const { id } = params
  return { id }
}

const PENDING_STATUS = "pending"
const ASKED_STATUS = "asked"
const initialQuestions = [
  {
    id: "1",
    type: "text",
    title: "What are the main challenges in your current role?",
    description: "Please provide detailed insights about the obstacles you face",
    required: true,
    placeholder: "Type your answer here...",
    maxLength: 500,
    status: PENDING_STATUS,
    user_response: null,
  },
  {
    id: "2",
    type: "text",
    title: "What industry trends are you most excited about?",
    description: "Share your thoughts on emerging technologies or methodologies",
    required: false,
    placeholder: "Share your thoughts...",
    minLength: 50,
    maxLength: 1000,
    status: PENDING_STATUS,
    user_response: null,
  },
  {
    id: "3",
    type: "number",
    title: "How many years of experience do you have in this field?",
    description: "Enter the number of years (decimals allowed)",
    required: true,
    min: 0,
    max: 50,
    step: 0.5,
    status: PENDING_STATUS,
    user_response: null,
  },
  {
    id: "4",
    type: "choice",
    title: "Which technology stack do you primarily work with?",
    description: "Select the main technology you use in your daily work",
    required: true,
    multiple: true,
    maxChoices: 2,
    choices: [
      { label: "React/Node.js", value: "react-node" },
      { label: "Python/Django", value: "python-django" },
      { label: "Java/Spring", value: "java-spring" },
      { label: "Ruby on Rails", value: "rails" },
    ],
    status: PENDING_STATUS,
    user_response: null,
  },
  {
    id: "5",
    type: "rating",
    title: "Rate your satisfaction with remote work",
    description: "Consider factors like productivity, work-life balance, and team collaboration",
    required: true,
    min: 1,
    max: 5,
    step: 1,
    labels: [
      { label: "Very Dissatisfied", value: 1 },
      { label: "Dissatisfied", value: 2 },
      { label: "Neutral", value: 3 },
      { label: "Satisfied", value: 4 },
      { label: "Very Satisfied", value: 5 },
    ],
    status: PENDING_STATUS,
    user_response: null,
  },
  {
    id: "6",
    type: "ranking",
    title: "Rank these factors in order of importance for job satisfaction",
    description: "Drag and drop items to arrange them from most to least important",
    required: false,
    allowTie: false,
    options: [
      { label: "Salary and Benefits", id: "salary", },
      { label: "Work-Life Balance", id: "balance", },
      { label: "Career Growth", id: "growth", },
      { label: "Company Culture", id: "culture", },
      { label: "Technical Challenges", id: "challenges", },
    ],
    status: PENDING_STATUS,
    user_response: null,
  },
  {
    id: "7",
    type: "matrix",
    title: "Indicate your experience level with these technologies",
    description: "Select your proficiency level for each technology",
    required: true,
    allowMultiplePerRow: false,
    requireAllRows: true,
    rows: [
      { label: "React", id: "react" },
      { label: "TypeScript", id: "typescript" },
      { label: "GraphQL", id: "graphql" },
      { label: "Docker", id: "docker" },
      { label: "Kubernetes", id: "kubernetes" },
      { label: "AWS", id: "aws" },
    ],
    columns: [
      { label: "Expert", id: "expert" },
      { label: "Intermediate", id: "intermediate" },
      { label: "Beginner", id: "beginner" },
      { label: "No Experience", id: "none" },
    ],
    status: PENDING_STATUS,
    user_response: null,
  },
]


export default function RespondentDetail() {
  const { id } = useLoaderData<typeof clientLoader>()
  const [questions, setQuestions] = useState(initialQuestions)

  return (
    <div className="absolute h-full w-full">
      <div className="relative h-full flex flex-col">
        <div className="flex-1 basis-0 grow shrink">
          <div className="h-full overflow-hidden">
            <div className="h-full w-full overflow-x-hidden overflow-y-auto">
              <TextQuestion
                title="Are there specific compliance requirements or regulations influencing enterprises to prefer native XDR solutions?"
                description="The company's revenue is approximately $100-120 million, with a constant 7-10% YoY and an EBITDA margin of 10-12%."
                required
                maxLength={10}
                placeholder="Type your answer here..."
                onSubmit={() => { }}
              />
              {/* <ChoiceQuestion
                title="Please select the companies you have worked with"
                description="The company's revenue is approximately $100-120 million, with a constant 7-10% YoY and an EBITDA margin of 10-12%."
                required
                choices={[
                  { label: "Youtube", value: "youtube" },
                  { label: "Mckensie & Company", value: "mckensie" },
                ]}
                onSubmit={() => { }}
              /> */}
              {/* <RatingQuestion
                title="Please select the companies you have worked with"
                description="The company's revenue is approximately $100-120 million, with a constant 7-10% YoY and an EBITDA margin of 10-12%."
                required
                onSubmit={() => { }}
                labels={[
                  { label: "poor", value: 1 },
                  { label: "great", value: 2 },
                  { label: "awesome", value: 3 },
                ]}
              /> */}
              {/* <RankingQuestion
                title="Please rank the companies you have worked with"
                description="The company's revenue is approximately $100-120 million, with a constant 7-10% YoY and an EBITDA margin of 10-12%."
                required
                onSubmit={() => { }}
                options={[
                  { label: "Youtube", id: "youtube" },
                  { label: "Mckensie & Company", id: "mckensie" },
                ]}
              /> */}
              {/* <MatrixQuestion
                title="Please rank the companies you have worked with"
                description="The company's revenue is approximately $100-120 million, with a constant 7-10% YoY and an EBITDA margin of 10-12%."
                required
                onSubmit={() => { }}
                options={[
                  { label: "Youtube", id: "youtube", value: "youtube" },
                  { label: "Mckensie & Company", id: "mckensie", value: "mckensie" },
                ]}
                columns={[
                  { label: "Youtube", id: "youtube" },
                  { label: "Mckensie & Company", id: "mckensie" },
                  { label: "Google", id: "google" },
                  { label: "Apple", id: "apple" },
                  { label: "Microsoft", id: "microsoft" },
                  { label: "Amazon", id: "amazon" },
                  { label: "Facebook", id: "facebook" },
                  { label: "Twitter", id: "twitter" },
                  { label: "Tesla", id: "tesla" },
                  { label: "SpaceX", id: "spacex" },
                  { label: "Tesla", id: "tesla" },
                  { label: "SpaceX", id: "spacex" },
                  { label: "Tesla", id: "tesla" },
                  { label: "SpaceX", id: "spacex" },
                ]}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 