import { Group } from "@/components/types";
import GroupsList from "./GroupsList";

type GroupsContentProps = {
  groups: Group[];
};

export default function GroupsContent({ groups }: GroupsContentProps) {
  return <GroupsList groups={groups} />;
}
