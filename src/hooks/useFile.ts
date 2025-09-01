import { useQuery } from "@tanstack/react-query";
import supabase from "src/superbase";

const fetchAllfiles = async () => {
  const { data, error } = await supabase.from("filemetadata").select("*");
  if (error) throw new Error(error.message);
  return data;
};
const fetchDepartments = async () => {
  const { data, error } = await supabase.from("departments").select("*");
  if (error) throw new Error(error.message);
  return data;
};
const fetchCategory = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw new Error(error.message);
  return data;
};
const searchFiles = async (query: string) => {
  const { data, error } = await supabase
    .from("filemetadata")
    .select("*")
    .or(
      `name.ilike.%${query}%,sender.ilike.%${query}%,receiver.ilike.%${query}%`
    );
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
const fetchCurrentUser = async () => {
  const { data: authuser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", authuser.user.email)
    .single();
  if (userError) throw new Error(userError.message);
  let department = null;
  if (user.department_id) {
    const { data: deptData, error: deptError } = await supabase
      .from("departments")
      .select("*")
      .eq("id", user.department_id)
      .single();

    if (deptError) {
      console.error("Error fetching department:", deptError);
    } else {
      department = deptData;
    }
  }

  return {
    ...user,
    department,
  };
};

const fetchAllUsers = async () => {
  const { data: authuser, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  const { data, error: userError } = await supabase.from("users").select("*");
  if (error) {
    throw new Error(userError.message);
  }

  return data;
};

const fetchSingleFile = async (id: string) => {
  const { data: Filedata, error } = await supabase
    .from("filemetadata")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return Filedata;
};

const fetchSingleCat = async (cat_id: string) => {
  const { data: category, error: cat_error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", cat_id)
    .single();
  if (cat_error) throw new Error(cat_error.message);
  return category;
};

const fetchNotifications=async(user_id:string)=>{
const { data, error } = await supabase
  .from("notification_history")
  .select(`
    id,
    title,
    body,
    sent_at,
    file_id,
    filemetadata ( id, name )
  `)
  .eq("user_id", "3b81cf97-3474-477d-babd-747ca4bbe80a")
  .order("sent_at", { ascending: false });

if (error) console.error(error);
else console.log(data);


      if (error) throw error;
      return data ?? [];
}
export const useNotiPanel=(user_id:string)=>{
  return useQuery({
    queryKey:["notifications"],
    queryFn:()=>fetchNotifications(user_id),
      enabled: !!user_id,
  })
}
export const useSingleCat = (cat_id?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["singleCategory", cat_id],
    queryFn: () => fetchSingleCat(cat_id as string),
    enabled: enabled,
  });
};

export const useFile = () => {
  return useQuery({
    queryKey: ["files"],
    queryFn: fetchAllfiles,
  });
};
export const useSingleFile = (id: string) => {
  return useQuery({
    queryKey: ["singleFile"],
    queryFn: () => fetchSingleFile(id),
  });
};
export const useDepartment = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
};
export const useCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategory,
  });
};
export const currentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
  });
};

export const getAllUsers = () => {
  return useQuery({
    queryKey: ["All_users"],
    queryFn: fetchAllUsers,
  });
};
export const useSearchFiles = (query: string) => {
  return useQuery({
    queryKey: ["searchFiles", query],
    queryFn: () => searchFiles(query),
    enabled: !!query,
  });
};
