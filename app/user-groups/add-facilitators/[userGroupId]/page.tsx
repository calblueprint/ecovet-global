import AddFacilitators from "../AddFacilitators";

export default function Page({ params }: { params: { userGroupId: string } }) {
  return <AddFacilitators userGroupId={params.userGroupId} />;
}
