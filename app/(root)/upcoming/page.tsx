import CallList from "@/components/CallList"
const page = () => {
  return (
    <section className="flex size-full flex-col gap-10">
        <h1 className="text-2xl font-bold">
            Upcoming Meetings
        </h1>

        <CallList type="upcoming"/>
    </section>
  )
}

export default page