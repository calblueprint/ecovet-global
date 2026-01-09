import Participants from "@/app/facilitator/participants/Participants";

export default function AdminGroupPage({
  params,
}: {
  params: { user_group_id: string };
}) {
  return <Participants user_group_id={params.user_group_id} />;
}
