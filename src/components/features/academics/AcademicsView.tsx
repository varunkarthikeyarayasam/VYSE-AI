import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, CheckCircle2, AlertTriangle, Clock, MapPin, User } from "lucide-react";
import { Card, Badge } from "../../ui";
import { getCourses, getTimetable, getAttendance, getStudentContext } from "../../../lib/api/academics";
import { useAuth } from "../../../store/authContext";
import type { Course, TimetableEntry, AttendanceRecord, StudentContextResult } from "../../../types/database";

export function AcademicsView() {
  const { student, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [context, setContext] = useState<StudentContextResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1);

  useEffect(() => {
    loadData();
  }, [student, user]);

  async function loadData() {
    setLoading(true);
    try {
      const studentId = student?.id || user?.id || "11111111-1111-1111-1111-111111111111";
      const [coursesData, timetableData, attendanceData, contextData] = await Promise.all([
        getCourses(),
        getTimetable("B"),
        getAttendance(studentId),
        getStudentContext(studentId),
      ]);
      setCourses(coursesData);
      setTimetable(timetableData);
      setAttendanceRecords(attendanceData);
      setContext(contextData);
    } catch (err) {
      console.error("Error loading academics data:", err);
    } finally {
      setLoading(false);
    }
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayClasses = timetable.filter((t) => t.day_of_week === selectedDay);

  const attPercent = context?.attendance?.attendance_percent || 82.0;
  const isThresholdMet = attPercent >= 75.0;

  return (
    <div className="space-y-6">
      {/* Attendance Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#111624] to-[#161D30]">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Aggregate Attendance Status
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-100">{attPercent}%</span>
              <Badge variant={isThresholdMet ? "success" : "danger"}>
                {isThresholdMet ? "Threshold Satisfied (>=75%)" : "Warning: Below 75%"}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {context?.attendance?.present_classes || 49} of {context?.attendance?.total_classes || 54} scheduled class hours attended.
            </p>
          </div>

          {/* 75% Threshold Visual Bar */}
          <div className="w-full sm:w-48 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0%</span>
              <span className="text-amber-400 font-bold">75% Req.</span>
              <span>100%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#090B10] p-0.5 border border-[#212738] relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isThresholdMet ? "bg-gradient-to-r from-indigo-500 to-emerald-400" : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(attPercent, 100)}%` }}
              />
              <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Registered Courses
          </span>
          <div className="text-3xl font-extrabold text-indigo-400">{courses.length}</div>
          <p className="text-xs text-slate-400">
            Total Semester Credits: {courses.reduce((acc, c) => acc + c.credits, 0)}
          </p>
        </Card>
      </div>

      {/* Timetable Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100">Weekly Academic Timetable</h3>
          {/* Day Tabs */}
          <div className="flex gap-1 bg-[#11141E] p-1 rounded-xl border border-[#212738]">
            {days.map((name, idx) => (
              <button
                key={name}
                onClick={() => setSelectedDay(idx + 1)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedDay === idx + 1
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dayClasses.length === 0 ? (
            <Card className="col-span-2 text-center py-8 text-slate-400 text-sm">
              No classes scheduled for {days[selectedDay - 1]}.
            </Card>
          ) : (
            dayClasses.map((cls) => (
              <Card key={cls.id} className="space-y-2 hover:border-[#333D56] transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="glow">{cls.course_code}</Badge>
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-100 text-sm">{cls.course_name}</h4>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#212738]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {cls.room}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" /> {cls.faculty_name}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Courses Catalog */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-100">Enrolled Course Curriculum</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {courses.map((course) => (
            <Card key={course.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400">{course.code}</span>
                <span className="text-xs text-slate-400">{course.credits} Credits</span>
              </div>
              <h4 className="font-semibold text-slate-100 text-sm">{course.name}</h4>
              <p className="text-xs text-slate-500">{course.department} • Year {course.year}, Sem {course.semester}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}