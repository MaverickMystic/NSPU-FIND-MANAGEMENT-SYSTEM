import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { usefileContext } from "src/boxContext";
import Navbar from "src/Components/Navbar";
import Newfile from "src/Components/Newfile";
import SideBar from "src/Components/Sidebar";
import { currentUser } from "src/hooks/useFile";
import supabase from "src/superbase";

function Main() {
  const { isOpen } = usefileContext();
  const { data: User, isLoading, error } = currentUser();
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    if (error) alert(error.message ?? error);
  }, [error]);
  useEffect(() => {
    if (!isLoading && User) {
      const fetchReminders = async () => {
        const { data: data_reminder, error } = await supabase
          .from("reminders")
          .select(
            `id,one_day,two_day,three_day,four_day,five_day, filemetadata(deadline, name,id)`
          )
          .eq("user_id", User.id);

        if (error) {
          console.error("Error fetching reminders:", error);
          return;
        }

        setReminders(data_reminder || []);
        return data_reminder || [];
      };

      const checkNotifications = async (remindersList: any[]) => {
        const now = Date.now();

        for (const reminder of remindersList) {
          const file = reminder.filemetadata;
          if (!file?.deadline) continue;

          const deadlineStr = file.deadline;
          const deadlineLocal = deadlineStr.split("+")[0];

          // Treat it as local time
          const deadlineDate = new Date(deadlineLocal);
          const now = new Date();
          const hoursLeft =
            (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

          console.log("hoursLeft", hoursLeft);

          console.log(hoursLeft);
          if (hoursLeft > 0) {
            if (hoursLeft <= 24 && !reminder.one_day) {
              window.electronAPI.notify(
                `Reminder: 1 day left`,
                `${file.name}will be due within 1 day`
              );

              await supabase
                .from("reminders")
                .update({ one_day: true })
                .eq("id", reminder.id);

                   await supabase.from("notification_history").insert({
                user_id:User.id,
                file_id:file.id,
                title:file.name,
                body:'due within 1 day'
              })
            } else if (
              hoursLeft <= 48 &&
              !reminder.two_day &&
              !reminder.one_day
            ) {
              window.electronAPI.notify(
                "Reminder: 2 days left",
                `File "${file.name}" is due within  2 days`
              );

              await supabase
                .from("reminders")
                .update({ two_day: true })
                .eq("id", reminder.id);

               await supabase.from("notification_history").insert([
  {
    user_id: User.id,
    file_id: file.id,
    title: file.name,
    body: "due within 2 days",
  },
]);

            } else if (
              hoursLeft <= 72 &&
              !reminder.one_day &&
              !reminder.two_day &&
              !reminder.three_day
            ) {
              window.electronAPI.notify(
                "Reminder:3 days  left",
                `File "${file.name}" is due within 3 days`
              );

              await supabase
                .from("reminders")
                .update({ three_day: true })
                .eq("id", reminder.id);

                 await supabase.from("notification_history").insert({
                user_id:User.id,
                file_id:file.id,
                title:file.name,
                body:'due within 3 days'
              })
            } else if (
              hoursLeft <= 96 &&
              !reminder.one_day &&
               !reminder.two_day &&
                !reminder.three_day &&
                 !reminder.four_day 
            ) {
              window.electronAPI.notify(
                "Reminder: 4 days day  left",
                `File "${file.name}" is within 4 days`
              );

              await supabase
                .from("reminders")
                .update({ four_day: true })
                .eq("id", reminder.id);
              
                 await supabase.from("notification_history").insert({
                user_id:User.id,
                file_id:file.id,
                title:file.name,
                body:'due within 4 days'
              })
            } else if (
              hoursLeft <= 120 &&
              !reminder.one_day &&
              !reminder.two_day&&
              !reminder.three_day&&
              !reminder.four_day&&
              !reminder.five_day

            ) {
              window.electronAPI.notify(
                "Reminder: five day  left",
                `File "${file.name}" is due within 5 days`
              );

              await supabase
                .from("reminders")
                .update({ fiveday_notified: true })
                .eq("id", reminder.id);

              await supabase.from("notification_history").insert({
                user_id:User.id,
                file_id:file.id,
                title:file.name,
                body:'due within 5 days'
              })
            }
          }
        }
      };

      const run = async () => {
        const remindersList = await fetchReminders();
        await checkNotifications(remindersList);
      };

      run();
      const fetchInterval = setInterval(run, 1000 * 60 * 30); // repeat every half an hour

      return () => clearInterval(fetchInterval);
    }
  }, [isLoading, User]);
  useEffect(() => {
    console.log("reminders updated:", reminders);
  }, [reminders]);

  return (
    <div className="flex h-screen w-full overflow-x-hidden relative ">
      {/* Sidebar */}
      <div className="overflow-y-hidden">
        <SideBar />
      </div>

      {isOpen && <Newfile />}

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <Navbar />
        <div className="w-full h-full px-4 py-3 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
