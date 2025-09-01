import { getAllUsers, useDepartment } from "src/hooks/useFile";
import supabase from "src/superbase";
import { CiTrash } from "react-icons/ci";
import supabaseAdmin from "src/superbaseAdmin";
function ManageUsers() {
  const { data, error, refetch, isLoading } = getAllUsers();
  const { data: departments, isLoading: loadingDepartments } = useDepartment();
  
const handleDepartmentChange = async (
  userId: string,
  departmentId: string
) => {
  if (!userId || !departmentId) {
    alert("Missing userId or departmentId");
    return;
  }

  const { error } = await supabase
    .from("users")
    .update({ department_id: departmentId })
    .eq("id", userId);

  if (error) {
    alert(error.message);
    console.error("Update failed:", error.message);
  } else {
    refetch();
  }
};
const handleRoleChange=async(
  userId:string,
  role:string
)=>{
  if(!userId || !role){
    alert("Missing user id or role");
    return;
  }
  const {error}=await supabase.from("users").update({role}).eq('id',userId);
  if(error){
    alert('cannot update role');
    console.log(error.message);
    return;

  }
  else{
    refetch();
  }
}
const deleteUser=async(userId:string)=>{
try {
   const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) {
    console.error('Failed to delete user:', error.message)
    return { success: false, message: error.message }
  }
  refetch();
  return { success: true }
} catch (error) {
  console.log(error);
  alert('something went wrong');
  return;
}
}
  
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {isLoading || loadingDepartments ? (
        <h1>Loading...</h1>
      ) : (
        <div className="m-3 items-center justify-center w-full flex gap-2 flex-col">
          {(data.filter((i)=>i.name!==null)).map((user) => (
            <div
              key={user.id}
              className="border-2 border-gray-500 rounded-md flex justify-between items-center w-full px-4 py-2"
            >
              <div className="flex items-center justify-center">
                <h1 className="font-semibold">{user.username}</h1>
              </div>
              <div className="flex items-center justify-between mx-2 gap-2">
                <select
                  value={user.department_id || ""}
                  onChange={(e) =>
                    handleDepartmentChange(user.id, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="">Select a department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <select   value={user.role||""}
                onChange={(e)=>handleRoleChange(user.id,e.target.value)}
                className="border rounded px-2 py-1"
                >
                <option value="user" >user</option>
                <option value="admin" >admin</option>
                </select>
                <div className="p-2 hover:bg-gray-200 rounded-full" onClick={()=>deleteUser(user.id)}>
                  <CiTrash className="text-sm font-bold text-red-600  m-1 "/>
                </div>
                 
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
