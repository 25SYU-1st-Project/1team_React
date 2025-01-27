import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have Firebase configured in a `firebase.js` file

function ProjWrite() {
  const [projectData, setProjectData] = useState({
    name: "",
    category: "",
    creatorId: "",
    description: "",
    eligibility: "",
    salary: 0,
    status: "open",
    projectPoster: "",
    techStack: [],
    tracks: [],
    applicantsId: [],
    participantsId: [],
    deadLine: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleArrayChange = (field, value) => {
    setProjectData({
      ...projectData,
      [field]: [...projectData[field], value],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 현재 날짜와 시간 추가
      const projectWithTimestamp = {
        ...projectData,
        createdAt: new Date(), // 현재 시간 추가
      };
  
      const projectsCollection = collection(db, "projects"); // 'projects' 컬렉션 참조
      const docRef = await addDoc(projectsCollection, projectWithTimestamp); // 프로젝트 데이터 추가
      alert("Project created successfully! ID: " + docRef.id);
      setProjectData({
        name: "",
        category: "",
        creatorId: "",
        description: "",
        eligibility: "",
        salary: 0,
        status: "open",
        projectPoster: "",
        techStack: [],
        tracks: [],
        applicantsId: [],
        participantsId: [],
        deadLine: [],
      });
    } catch (error) {
      console.error("Error creating project: ", error);
      alert("Failed to create project!");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Project Name</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={projectData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Creator ID</label>
          <input
            type="text"
            name="creatorId"
            value={projectData.creatorId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Eligibility</label>
          <input
            type="text"
            name="eligibility"
            value={projectData.eligibility}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Salary</label>
          <input
            type="number"
            name="salary"
            value={projectData.salary}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Project Poster (URL)</label>
          <input
            type="url"
            name="projectPoster"
            value={projectData.projectPoster}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tech Stack</label>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleArrayChange("techStack", e.target.value);
                e.target.value = "";
              }
            }}
            placeholder="Press Enter to add"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tracks</label>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleArrayChange("tracks", e.target.value);
                e.target.value = "";
              }
            }}
            placeholder="Press Enter to add"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Deadlines</label>
          <input
            type="datetime-local"
            onBlur={(e) =>
              handleArrayChange("deadLine", new Date(e.target.value).toISOString())
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
}

export default ProjWrite;
