"use client";

import { ProjectType } from "@/type/type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectList() {
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetProjectList();
  }, []);

  const GetProjectList = async () => {
    setLoading(true);
    const result = await axios.get("/api/project");
    console.log(result.data);
    setProjectList(result.data);
    setLoading(false);
  };
  return (
    <div className="px-10 md:px-24 lg:px-44 xl:px-56">
      <h2 className="font-bold  text-xl">My Projects</h2>

      {!loading && projectList?.length < 0 && (
        <div className="p-6 border-dashed rounded-3xl">
          <h2 className="text-center">No Project Available</h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {!loading
          ? projectList?.map((project, index) => (
              <ProjectCard project={project} />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div>
                <Skeleton className="rounded-2xl bg-gray-100 h-[200px] w-full" />
                <Skeleton className="mt-3 rounded-2xl bg-gray-100 h-6 w-full" />
              </div>
            ))}
      </div>
    </div>
  );
}

export default ProjectList;
