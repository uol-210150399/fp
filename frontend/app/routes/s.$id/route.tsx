import { type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { TextQuestion } from "./components/questions/text-question"
import { NumberQuestion } from "./components/questions/number-question"
import { ChoiceQuestion } from "./components/questions/choice-question"
import { RatingQuestion } from "./components/questions/rating-question"
import { RankingQuestion } from "./components/questions/ranking-question"
import { MatrixQuestion } from "./components/questions/matrix-question"
import { Button } from "node_modules/@headlessui/react/dist/components/button/button"

export function clientLoader({ params }: LoaderFunctionArgs) {
  const { id } = params
  return { id }
}

export default function RespondentDetail() {
  const { id } = useLoaderData<typeof clientLoader>()
  console.log({ id })

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