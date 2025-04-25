"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownUp,
  Filter,
  Pencil,
  Plus,
  Trash,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Task, useTaskContext } from "@/context/TaskContext";
import DeleteConfirmationPopup from "./DeleteConfirmPopup";
import EditTaskPopup from "./EditTaskPopup";
import AddTaskPopup from "./AddTaskPopup";

type SortDirection = "asc" | "desc" | null;
type FilterOptions = {
  priority: string[];
  status: string[];
};

interface TasksTableProps {
  searchQuery?: string;
}

const TasksTable: React.FC<TasksTableProps> = ({ searchQuery = "" }) => {
  const { tasks, deleteTask, updateTaskPriority, updateTask, addTask } =
    useTaskContext();
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    priority: [],
    status: [],
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRowExpansion = (taskId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Search functionality
  const searchTasks = (tasks: Task[]) => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle task deletion
  const handleDelete = (id: number) => {
    setTaskToDelete(id);
    setDeletePopupOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
      setDeletePopupOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handle task editing
  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setEditPopupOpen(true);
  };

  const handleSaveEdit = (updatedTask: {
    title: string;
    description: string;
    dueDate: string;
    status: "Completed" | "In Progress";
  }) => {
    if (taskToEdit) {
      updateTask({
        ...taskToEdit,
        ...updatedTask,
      });
      setEditPopupOpen(false);
      setTaskToEdit(null);
    }
  };

  // Handle task addition
  const handleAddTask = (newTask: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    addTask({
      id: newId,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: "In Progress",
      priority: "Low",
    });
  };

  // Handle priority change
  const handlePriorityChange = (id: number, newPriority: string) => {
    updateTaskPriority(id, newPriority);
  };

  const getOtherPriorities = (current: string) => {
    const all = ["High", "Medium", "Low"];
    return all.filter((p) => p !== current);
  };

  // Sorting functionality
  const toggleSort = () => {
    setSortDirection((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const sortTasks = (tasks: Task[]) => {
    if (!sortDirection) return tasks;

    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Filtering functionality
  const toggleFilter = (type: "priority" | "status", value: string) => {
    setFilterOptions((prev) => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [type]: newValues,
      };
    });
  };

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const priorityMatch =
        filterOptions.priority.length === 0 ||
        filterOptions.priority.includes(task.priority);
      const statusMatch =
        filterOptions.status.length === 0 ||
        filterOptions.status.includes(task.status);

      return priorityMatch && statusMatch;
    });
  };

  // Process tasks with search, sorting and filtering
  const processedTasks = searchTasks(filterTasks(sortTasks(tasks)));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Tasks</h1>
        <div className="flex space-x-2 md:space-x-4">
          <button
            className="p-2 px-4 py-2 text-white bg-[#941B0F] rounded border-2 border-[#941B0F] cursor-pointer flex items-center"
            onClick={() => setAddPopupOpen(true)}
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5 md:mr-2" />
            <span >Add Task</span>
          </button>
          <button
            className={`p-2 md:px-4 md:py-2 border-2 border-[#941B0F] text-[#941B0F] font-bold bg-white rounded cursor-pointer flex items-center ${
              sortDirection ? "bg-[#FFF9F8]" : ""
            }`}
            onClick={toggleSort}
          >
            <ArrowDownUp className="h-4 w-4 md:h-5 md:w-5 md:mr-2" />
            <span className="hidden md:inline">
              Sort {sortDirection && `(${sortDirection})`}
            </span>
          </button>
          <div className="relative">
            <button
              className={`p-2 md:px-4 md:py-2 border-2 border-[#941B0F] text-[#941B0F] font-bold bg-white rounded cursor-pointer flex items-center ${
                filterOptions.priority.length > 0 ||
                filterOptions.status.length > 0
                  ? "bg-[#FFF9F8]"
                  : ""
              }`}
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="h-6 w-4 md:h-5 md:w-5 md:mr-2" />
              <span className="hidden md:inline">Filter</span>
            </button>
            {showFilterMenu && (
              <div
                ref={filterMenuRef}
                className="absolute right-0 mt-2 w-56 bg-[#FFF9F8] rounded-md shadow-lg z-10 border border-[#941B0F]"
              >
                <div className="p-4">
                  <h4 className="font-medium text-[#941B0F] mb-2">Priority</h4>
                  <div className="space-y-2">
                    {["High", "Medium", "Low"].map((priority) => (
                      <label
                        key={priority}
                        className="flex items-center text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={filterOptions.priority.includes(priority)}
                          onChange={() => toggleFilter("priority", priority)}
                          className="mr-2 cursor-pointer"
                        />
                        {priority}
                      </label>
                    ))}
                  </div>
                  <h4 className="font-medium text-[#941B0F] mt-4 mb-2">
                    Status
                  </h4>
                  <div className="space-y-2">
                    {["In Progress", "Completed"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={filterOptions.status.includes(status)}
                          onChange={() => toggleFilter("status", status)}
                          className="mr-2 cursor-pointer"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:block overflow-x-auto border border-[#941B0F] rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-[#FFF9F8]">
            <tr>
              {[
                "SL.No",
                "Title",
                "Description",
                "Due Date",
                "Status",
                "Priority",
                "",
              ].map((heading, idx) => (
                <th
                  key={idx}
                  className="py-3 px-4 border-b border-[#941B0F] text-left text-gray-700 font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedTasks.length > 0 ? (
              processedTasks.map((task, index) => (
                <tr
                  key={task.id}
                  className={index % 2 !== 0 ? "bg-[#FFF9F8]" : "bg-white"}
                >
                  <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs break-words whitespace-normal">
                    {task.title}
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs break-words whitespace-normal">
                    {task.description}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(task.dueDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        task.status === "Completed"
                          ? "bg-[#03A229]"
                          : "bg-[#F5D20E] text-black"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <select
                      className="bg-transparent outline-none border border-black p-1 rounded-sm"
                      value={task.priority}
                      onChange={(e) =>
                        handlePriorityChange(task.id, e.target.value)
                      }
                    >
                      <option value={task.priority}>{task.priority}</option>
                      {getOtherPriorities(task.priority).map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-5">
                      <Pencil
                        className="w-5 h-5 cursor-pointer hover:text-blue-600"
                        onClick={() => handleEdit(task)}
                      />
                      <Trash
                        className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                        onClick={() => handleDelete(task.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No tasks found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden space-y-3">
        {processedTasks.length > 0 ? (
          <div className="border border-[#941B0F] rounded-lg overflow-hidden">
            {processedTasks.map((task, index) => (
              <div
                key={task.id}
                className={`${index % 2 !== 0 ? "bg-[#FFF9F8]" : "bg-white"}`}
              >
                <div
                  className="p-3 flex items-center cursor-pointer"
                  onClick={() => toggleRowExpansion(task.id)}
                >
                  <div className="w-1/3 font-medium text-[#941B0F]">Si.No</div>
                  <div className="w-2/3 ml-2 text-gray-600">{index + 1}</div>

                  <div className="flex justify-end ">
                    {expandedRows[task.id] ? (
                      <ChevronUp
                        className="h-5 w-5 text-[#941B0F]"
                        onClick={() => toggleRowExpansion(task.id)}
                      />
                    ) : (
                      <ChevronDown
                        className="h-5 w-5 text-[#941B0F]"
                        onClick={() => toggleRowExpansion(task.id)}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="p-3 flex items-center cursor-pointer"
                  onClick={() => toggleRowExpansion(task.id)}
                >
                  <div className="w-1/3 font-medium text-[#941B0F]">Title</div>
                  <div className="w-2/3 text-gray-600">{task.title}</div>
                </div>

                {expandedRows[task.id] && (
                  <div className="p-3 space-y-4">
                    {/* Description */}
                    <div className="flex">
                      <div className="w-1/3 font-medium text-[#941B0F]">
                        Description
                      </div>
                      <div className="w-2/3 text-gray-600 whitespace-pre-line">
                        {task.description}
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex">
                      <div className="w-1/3 font-medium text-[#941B0F]">
                        Due Date
                      </div>
                      <div className="w-2/3 text-gray-700">
                        {new Date(task.dueDate)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex">
                      <div className="w-1/3 font-medium text-[#941B0F]">
                        Status
                      </div>
                      <div className="w-2/3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            task.status === "Completed"
                              ? "bg-[#03A229] text-white"
                              : "bg-[#F5D20E] text-black"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex">
                      <div className="w-1/3 font-medium text-[#941B0F]">
                        Priority
                      </div>
                      <div className="w-2/3">
                        <select
                          className="bg-transparent outline-none border border-black p-1 rounded-sm w-full max-w-[120px]"
                          value={task.priority}
                          onChange={(e) =>
                            handlePriorityChange(task.id, e.target.value)
                          }
                        >
                          <option value={task.priority}>{task.priority}</option>
                          {getOtherPriorities(task.priority).map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            No tasks found matching your criteria
          </div>
        )}
      </div>

      <DeleteConfirmationPopup
        isOpen={deletePopupOpen}
        onCancel={() => setDeletePopupOpen(false)}
        onConfirm={confirmDelete}
      />

      <EditTaskPopup
        isOpen={editPopupOpen}
        onClose={() => setEditPopupOpen(false)}
        onSave={handleSaveEdit}
        initialData={{
          title: taskToEdit?.title || "",
          description: taskToEdit?.description || "",
          dueDate: taskToEdit?.dueDate || "",
          status: taskToEdit?.status || "In Progress",
        }}
      />

      <AddTaskPopup
        isOpen={addPopupOpen}
        onClose={() => setAddPopupOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};

export default TasksTable;
