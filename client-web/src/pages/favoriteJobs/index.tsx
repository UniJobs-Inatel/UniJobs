import { JobCard } from "@/components/ui/jobCard";
import { Job } from "@/domain/job";
import { useState } from "react";

const FavoriteJobs = () => {

    const [jobs] = useState<Job[]>([
        {
          job_name: "Software Engineer",
          description: "Develop and maintain software solutions.",
          location: "New York",
          type: "clt",
          weekly_hours: 40,
          mode: "remote",
          benefits: "Health insurance, 401k",
          salary: 80000,
          requirements: "3+ years experience with Node.js and React",
          id: 1,
          isPublishedOnAllColleges:false,
          company:{}
        }
      ])

  return (
    <div>
      <h3 className=" text-[20px] font-bold mb-6">
        Minhas vagas favoritas
      </h3>

      <section>
        {jobs && jobs.map((job) => <JobCard  key={job.id} job={job} publishJob={function (jobId: number): void {
          throw new Error("Function not implemented.");
        } } />)}
      </section>
    </div>
  );
};

export default FavoriteJobs;
