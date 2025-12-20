import GroupsList from "./GroupsList";

type Group = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
};

type GroupsContentProps = {
  groups: Group[];
};

export default function GroupsContent({ groups }: GroupsContentProps) {
  return <GroupsList groups={groups} />;
}
