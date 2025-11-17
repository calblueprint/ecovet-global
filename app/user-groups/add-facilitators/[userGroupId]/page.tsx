import AddFacilitators from "../AddFacilitators";

interface PageProps {
  params: { userGroupId: string };
}

export default function Page({ params }: PageProps) {
  const { userGroupId } = params;

  return <AddFacilitators userGroupId={userGroupId} />;
}
