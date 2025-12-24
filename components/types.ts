export type Note = {
  id: string;
  name?: string;
  description?: string | null;
  imageUrl: string;
  link?: string | null;
};

export type Board = {
  id: string;
  name: string;
  description?: string | null;
  notes?: Note[];
  group?: {
    id: string;
    name: string;
  };
};

export type Group = {
  id: string;
  name: string;
  description?: string | null;
  backgroundColor: string;
  textColor: string;
};
