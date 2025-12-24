export type Note = {
  id: string;
  name?: string;
  description?: string | null;
  imageUrl: string;
  link?: string | null;
  createdAt?: Date | string;
};

export type Board = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: Date | string;
  notes?: Note[];
  group?: {
    id: string;
    name: string;
    backgroundColor?: string;
    textColor?: string;
  };
  _count?: {
    notes: number;
  };
};

export type Group = {
  id: string;
  name: string;
  description?: string | null;
  backgroundColor: string;
  textColor: string;
  createdAt: Date | string;
  _count?: {
    boards: number;
  };
};
