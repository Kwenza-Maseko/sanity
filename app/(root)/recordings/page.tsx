import CallList from "@/components/CallList"
const page = () => {
  return (
    <section className="flex size-full flex-col gap-10">
        <h1 className="text-2xl font-bold">
            Recordings
        </h1>

        <CallList type="recordings"/>
    </section>
  )
}

export default page