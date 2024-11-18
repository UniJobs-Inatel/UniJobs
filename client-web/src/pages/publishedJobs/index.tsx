import { JobCard } from "@/components/ui/jobCard";
import {  JobPublication } from "@/domain/job";
import { getAllPublisedCompanyJob } from "@/services";
import { useEffect, useState } from "react";

const PublishedJobs = () => {
  const [publishedJobs, setPublishedJobs] = useState<JobPublication[]>([]);

  const getPublichedJob = async() => {
    const response = await getAllPublisedCompanyJob()
    setPublishedJobs(response)
  }

  useEffect(() => {
    getPublichedJob()
  },[])

  return (
    <div>
      <section>
      <h3 className=" text-[20px] font-bold mb-6">
        Vagas publicadas
      </h3>
        {publishedJobs && publishedJobs.map((publishedJob) => <JobCard  key={publishedJob.id} job={publishedJob.job} />)}
      </section>
    </div>
  );
};

export default PublishedJobs;
